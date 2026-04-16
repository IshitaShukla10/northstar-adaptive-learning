"""
integration/ — shared Python modules that wire the AI core (src/) to the backend API.

Modules:
    bridge          MasteryEngine ↔ analytics data transforms; CSV loaders
    engine_state    Process-level MasteryEngine + KnowledgeGraph singleton
    insights        Weekly analytics report generator (Sia/P4)
    kinesthetics    Kinesthetic quiz generation and mastery scoring
    lecture         PDF text → lecture script → TTS audio
"""
