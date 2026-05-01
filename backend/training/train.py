from __future__ import annotations

import argparse
import shutil
from pathlib import Path

from ultralytics import YOLO


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Train a YOLOv8 model for driver monitoring.")
    parser.add_argument("--data", default="backend/training/dataset.yaml", help="Path to dataset YAML")
    parser.add_argument("--model", default="yolov8n.pt", help="Base YOLOv8 checkpoint")
    parser.add_argument("--epochs", type=int, default=20, help="Training epochs")
    parser.add_argument("--imgsz", type=int, default=640, help="Input image size")
    parser.add_argument("--batch", type=int, default=16, help="Batch size")
    parser.add_argument("--workers", type=int, default=8, help="Data loader workers")
    parser.add_argument("--device", default="auto", help="Training device")
    parser.add_argument("--project", default="backend/runs", help="Output directory")
    parser.add_argument("--name", default="driver_monitor", help="Training run name")
    parser.add_argument("--resume", action="store_true", help="Resume the latest run")
    parser.add_argument("--cache", action="store_true", help="Cache images in RAM/disk")
    return parser.parse_args()


def validate_dataset(data_path: Path) -> None:
    if not data_path.exists():
        raise FileNotFoundError(f"Dataset YAML not found: {data_path}")

    dataset_root = Path("backend/dataset")
    expected_dirs = [
        dataset_root / "images" / "train",
        dataset_root / "images" / "val",
        dataset_root / "labels" / "train",
        dataset_root / "labels" / "val",
    ]
    missing = [str(path) for path in expected_dirs if not path.exists()]
    if missing:
        print("Warning: Some dataset folders do not exist yet:")
        for path in missing:
            print(f" - {path}")


def sync_best_weights(run_dir: Path) -> None:
    best_weights = run_dir / "weights" / "best.pt"
    target_path = Path("backend/models/best.pt")
    target_path.parent.mkdir(parents=True, exist_ok=True)
    if best_weights.exists():
        shutil.copy2(best_weights, target_path)
        print(f"Saved trained model to {target_path}")
    else:
        print(f"Training completed, but best.pt was not found at {best_weights}")


def main() -> None:
    args = parse_args()
    data_path = Path(args.data)
    validate_dataset(data_path)

    model = YOLO(args.model)
    results = model.train(
        data=str(data_path),
        epochs=args.epochs,
        imgsz=args.imgsz,
        batch=args.batch,
        workers=args.workers,
        device=args.device,
        project=args.project,
        name=args.name,
        cache=args.cache,
        resume=args.resume,
        pretrained=True,
        patience=10,
        verbose=True,
    )
    sync_best_weights(Path(results.save_dir))


if __name__ == "__main__":
    main()