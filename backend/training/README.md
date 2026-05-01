# YOLOv8 Training Workflow

This folder contains the training workflow for the custom driver monitoring detector.

## Classes

- `safe`
- `phone`
- `drowsy`
- `looking_away`

## Recommended dataset structure

```text
backend/dataset/
  images/
    train/
    val/
    test/
  labels/
    train/
    val/
    test/
```

Each image should have a matching `.txt` label file in YOLO format.

## Annotation workflow

You can annotate with Roboflow or LabelImg.

- Draw bounding boxes around the relevant driving state.
- Export in YOLO format.
- Keep class names consistent with `dataset.yaml`.

## Training command

```bash
yolo detect train data=backend/training/dataset.yaml model=yolov8n.pt epochs=20
```

## Scripted training

```bash
python backend/train.py --data backend/training/dataset.yaml --model yolov8n.pt --epochs 20
```

## Output model

The best checkpoint is copied to:

```text
backend/models/best.pt
```

## Notes

- Increase `epochs` for larger datasets.
- Use `--cache` for faster iterations on a local machine.
- Adjust `imgsz`, batch size, and augmentation settings based on your hardware.