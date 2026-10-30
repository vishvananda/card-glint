# GPU material reference

gpu-material-078.json.gz contains the four expanded, repository-authored
material fragment shaders from commit 8097bfa8b37b52c4ef19eec5f1c9ac8e475db687
(version 0.7.8). It contains no external card artwork.

gpu-material-parity.mjs checks the frozen compressed hash, then compares the
reference and current shader using synthetic rasters in the same software WebGL
backend. The matrix covers ten finishes, with and without local coating and
printing. It also checks that warm frames compile no additional shaders.
It measures output compatibility, not hardware GPU performance.
