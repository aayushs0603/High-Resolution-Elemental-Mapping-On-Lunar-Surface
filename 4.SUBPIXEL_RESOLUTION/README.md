# Subpixel Resolution using Overlapping Tracks

## About the Project

The project aims to create high-resolution elemental abundance maps for lunar regions using a multi-step pipeline that integrates geospatial data processing and a hybrid graph-based deep learning model. The model combines the strengths of Graph Neural Networks (GNNs) for global consistency and Convolutional Neural Networks (CNNs) for learning local attributes, merging their features for accurate predictions. The workflow involves preprocessing lunar surface data by classifying pixels (mare or highland), segmenting maps into grids, and updating elemental abundances using optimization methods. A sliding window approach facilitates subregion graph creation, enabling data diffusion across overlapping areas. The pipeline incorporates robust loss functions like masked MSE and spatial similarity loss for effective training. Outputs include refined subregion CSVs with predicted abundances and PyTorch Geometric graph data for iterative training and predictions.

### Key Features

- Extraction of surface characteristics to initialise GIB
- Classification of lunar regions into Mare and Highlands.
- Abundance calculation using Lagrangian Optimisation Theory and Abundance Population
- Overlapping sub-graph creation
- Leveraging GNN and CNN to predict elemental abundances by Abundance Generalisation

## Getting Started

### Prerequisites

Ensure the following files are downloaded on your system:

1. https://planetarymaps.usgs.gov/mosaic/Lunar_LRO_LROC-WAC_Mosaic_global_100m_June2013.tif
2. https://drive.google.com/file/d/1Ig5nXZqwscWYRLWgD22a76N5AsIDF2cv/view
3. https://drive.google.com/file/d/1RgGrRBntdAb6aMf7mvAgD23WunY2uqv8/view
4. https://drive.google.com/file/d/1LqYxaY08nyZqGlK0Udd28MzekwzwLsCz/view
5. https://drive.google.com/file/d/11794ulttX9D46Onumwvg6ToBJCGd9M05L/view
6. https://drive.google.com/file/d/15DUqZp716VV60jBM8V0CCg2oQdlBXlDU/view
7. https://drive.google.com/file/d/1Ltm2PjQvXCQ-NiJjARWrJGsr74AxWv3g/view
8. https://drive.google.com/file/d/1agqOartoVDRJ65yG_gxmtF6Z6oyk7Xd4/view
9. https://drive.google.com/file/d/1ul-A8zHvUUOl62F0fzDqm8wL49GNuDiL/view

All these files must be located in the root directory of the folder

### Installation

1. Install required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Code Structure

The project is structured into three main parts:

1. **(PART1.py) (GIB Initialisation) Part 1**: Initializes GIB consisting of 64 lunar regions, by extracting features for 2x2 km pixels via ResNet-50 and feature selection by variance thresholding.
2. **(final.py) (Abundance Population) Part 2**: File-based population of subregions with computed abundances.
3. **(final.py) (Abundance Generalisation) Part 3**: Overlapping Subgraph construction and and training them using the hybrid architecture of GNN and CNN.

## Execution Instructions

### Part 1 (GIB Initialisation) Execution

Disclaimer: GIB takes up close to 48 GiB space, the code is optimised to run on cuda.

To run the PART 1 of the final.py file we need to execute the following command

   python PART1.py

Ensure the following input files are available in the working directory:

1. LROC_GLOBAL_MARE_180.SHP (Shapefile for mare classification)
2. LROC_GLOBAL_MARE_180.DBF
3. LROC_GLOBAL_MARE_180.PRJ
4. LROC_GLOBAL_MARE_180.SHP.XML
5. LROC_GLOBAL_MARE_180.SHX
6. LROC_GLOBAL_MARE_README.TXT
7. LROC_GLOBAL_MARE.PNG
8. Lunar_LRO_LROC-WAC_Mosaic_global_100m_June2013.tif (Lunar surface TIFF file)

The processed output will be saved in the corresponding csv files that will have a nomenclature similar to ./regions/ISRO_RegionData**/subregion_i_j.csv

Execute Part1 only once to initialise GIB.

### Part 2 (Abudance Population) Execution

To run the PART 2 of the methodology (Abundance Population) We need to execute the following command

Assuming input.csv contains the data to be added. Headers required in input.csv:

| lat0 | lon0 | lat1 | lon1 | lat2 | lon2 | lat3 | lon3 | Fe | Ti | Ca | Si | Al | Mg | Na | O | chi2 |  |
| ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- | -- | -- | -- | -- | -- | -- | -- | - | ---- | - |

```
python final.py 1 input.csv
```

This will populate all the regions csv and create a file by the name of PART2Output.npz (an example is present in OLD_RUN folder) in the current directory which is required for Abundance Generalisation to run. It contains information regarding the number of enteries added in each region and subregion along with the updated indices of each region file. This is required for mask creation during Abudance Generalisation.

### Part 3 (Abundance Generalisation) Execution

The remaining portions of the project (including training and graph updates) are handled by `final.py`.

Part2 on the new file will output the number of enteries added in each region, you can choose to finetune on selective regions or all regions 1 by 1. (Its recommened to finetune a region further only if number of samples added > 2000).

Use the following command template to execute region specific training:

To train on subregion 0, 4 using parameters mode = 2, todo = run, and num_iterations = 3:

```bash
  python final.py 2 run 0 4 3
```

Replace the command-line arguments appropriately based on the subregions and iterations you are targeting:

- **Argument 1**: Mode of operation (1 for Part2 and 2 for Part3)
- **Argument 2**: Filename or run
- **Arguments 3 and 4**: Subregion identifiers(row and column number which are zero-indexed).
- **Argument 5**: Iteration number.

The pretrained models are automatically saved and loaded from in drive/MyDrive/ISRO_SuperResolution/models/

The first execution for any region will take longer and also create masks. Do not delete these masks as they are used to store number of old runs which is required for future runs.

We have pretrained the model on the subregion 0, 2 and saved the mask, model, subregion file, and PART2Output.npz.
