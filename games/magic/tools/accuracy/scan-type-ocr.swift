// Optional macOS diagnostic. Recognizes pre-cropped reference type lines only;
// it never supplies renderer geometry or silently certifies a correction.
import Foundation
import Vision

guard CommandLine.arguments.count == 2 else {
    throw NSError(domain: "scan-type-ocr", code: 1,
                  userInfo: [NSLocalizedDescriptionKey: "Usage: scan-type-ocr MANIFEST.json"])
}
let bytes = try Data(contentsOf: URL(fileURLWithPath: CommandLine.arguments[1]))
guard let rows = try JSONSerialization.jsonObject(with: bytes) as? [[String: String]],
      VNRecognizeTextRequest.supportedRevisions.contains(3) else {
    throw NSError(domain: "scan-type-ocr", code: 2,
                  userInfo: [NSLocalizedDescriptionKey: "Invalid manifest or unavailable Vision revision 3"])
}
let request = VNRecognizeTextRequest()
request.revision = 3
request.recognitionLevel = .accurate
request.usesLanguageCorrection = false
request.recognitionLanguages = ["en-US"]
request.minimumTextHeight = 0.15
for row in rows {
    let result: [String: Any] = autoreleasepool {
        guard let id = row["id"], let file = row["file"] else {
            return ["error": "Missing printing ID or crop path"]
        }
        do {
            let handler = VNImageRequestHandler(url: URL(fileURLWithPath: file))
            try handler.perform([request])
            let observations: [[String: Any]] = (request.results ?? []).map { observation in
                let bounds = observation.boundingBox
                return [
                    "bounds": [Double(bounds.minX), Double(bounds.minY), Double(bounds.width), Double(bounds.height)],
                    "candidates": observation.topCandidates(3).map {
                        ["text": $0.string, "confidence": Double($0.confidence)] as [String: Any]
                    }
                ]
            }
            return ["id": id, "engine": "macos-vision-rev3", "observations": observations]
        } catch {
            return ["id": id, "engine": "macos-vision-rev3", "error": String(describing: error)]
        }
    }
    let data = try JSONSerialization.data(withJSONObject: result, options: [.sortedKeys])
    FileHandle.standardOutput.write(data)
    FileHandle.standardOutput.write(Data([10]))
}
