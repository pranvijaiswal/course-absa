from pyabsa import APCCheckpointManager
from pyabsa.trainer import Trainer # APC for Aspect Polarity Classification

class ABSAService:
    def __init__(self, checkpoint="multilingual"):
        try:
            # Use the checkpoint manager to load the model
            self.classifier = APCCheckpointManager.parse_checkpoint(checkpoint)
        except Exception as e:
            raise RuntimeError(f"Failed to load checkpoint '{checkpoint}': {e}")

    def analyze_text(self, text: str):
        res = self.classifier.infer(text)
        out = [
            {
                "aspect": item.get("aspect"),
                "opinion": item.get("opinion"),
                "sentiment": item.get("sentiment"),
                "polarity": item.get("polarity", item.get("sentiment"))
            } for item in res
        ]
        return out


if __name__ == "__main__":
    absa = ABSAService()
    print(absa.analyze_text("The instructor was amazing but the course structure is confusing."))
