/** GLSL ES 3 host contract. The host owns sampler types, layers and residency. */
export const HOST_SAMPLING_GLSL = `
#ifdef GLINT_HOST_SAMPLING
#ifndef GLINT_HOST_BINDINGS
#define GLINT_HOST_BINDINGS
flat in vec2 facePixelSize;
flat in float previewKind;
flat in float hasMask;
flat in float aspect;
flat in vec2 pointer;
#ifdef GLINT_ART_PAIR
flat in vec4 artBounds;
flat in vec4 artBounds2;
#else
flat in vec4 artBounds[8];
#endif
// Linear RGB, straight alpha. Mask coverage is linear red-channel data.
vec4 glintSampleFace(vec2 uv);
float glintSampleMask(vec2 uv);
#endif
#endif
`;
