from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public/assets/premium-hoop-source"
OUTPUT_THEMES = ("classic-arcade", "open-court", "pup-arcade")
CANVAS_SIZE = 1254


def fit_to_canvas(image, max_width, max_height, top):
    alpha_box = image.getchannel("A").getbbox()
    trimmed = image.crop(alpha_box)
    scale = min(max_width / trimmed.width, max_height / trimmed.height)
    resized = trimmed.resize(
        (round(trimmed.width * scale), round(trimmed.height * scale)),
        Image.Resampling.LANCZOS,
    )
    canvas = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE))
    canvas.alpha_composite(resized, ((CANVAS_SIZE - resized.width) // 2, top))
    return canvas


def build_net_frames():
    sheet = Image.open(SOURCE / "net-sheet.png").convert("RGBA")
    half_width = sheet.width // 2
    half_height = sheet.height // 2
    frames = {
        "rest": (0, 0, half_width, half_height),
        "open": (half_width, 0, sheet.width, half_height),
        "stretch": (0, half_height, half_width, sheet.height),
        "snap": (half_width, half_height, sheet.width, sheet.height),
    }
    return {
        name: fit_to_canvas(sheet.crop(box), 790, 790, 236)
        for name, box in frames.items()
    }


def build_rim_layers():
    rim = Image.open(SOURCE / "rim.png").convert("RGBA")
    fitted = fit_to_canvas(rim, 1120, 430, 350)
    split_y = 615
    rear = fitted.copy()
    rear.paste((0, 0, 0, 0), (0, split_y, CANVAS_SIZE, CANVAS_SIZE))
    front = fitted.copy()
    front.paste((0, 0, 0, 0), (0, 0, CANVAS_SIZE, split_y))
    return rear, front


def main():
    nets = build_net_frames()
    rear_rim, front_rim = build_rim_layers()
    for theme in OUTPUT_THEMES:
        directory = ROOT / "public/assets" / theme
        rear_rim.save(directory / "rim-back.png", optimize=True)
        front_rim.save(directory / "rim-front.png", optimize=True)
        for state, frame in nets.items():
            frame.save(directory / f"net-{state}.png", optimize=True)


if __name__ == "__main__":
    main()
