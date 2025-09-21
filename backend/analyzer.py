# analyzer.py
from pyabsa.functional import Trainer, ClassificationCheckpointManager

class ABSAService:
    def __init__(self, model_name="multilingual"):  
        # Load a pre-trained sentiment classifier checkpoint
        self.classifier = ClassificationCheckpointManager.get_sentiment_classifier(checkpoint=model_name)

    def analyze_text(self, text: str):
        # Predict sentiment for a single text
        res = self.classifier.infer(text)
        out = []
        for item in res:
            out.append({
                "aspect": item.get('aspect', None),
                "opinion": item.get('opinion', None),
                "sentiment": item.get('sentiment'),
                "polarity": item.get('polarity', item.get('sentiment'))
            })
        return out

if __name__ == "__main__":
    s = ABSAService()
    print(s.analyze_text("The instructor was amazing but the course structure is confusing."))
