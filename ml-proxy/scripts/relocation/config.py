import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

API_KEY: str | None = os.getenv("GEMINI_API_KEY")
RISK_ZONES_DIR: Path = Path(os.getenv("OUTPUT_DIR", "./outputs/risk_zone_output_data"))
CAPACITY_DIR: Path = Path("./outputs/capacity_output_data")
RELOCATION_OUTPUT_DIR: Path = Path("./outputs/relocation_output_data")
MODEL_ID: str = "gemini-2.5-flash"

ALL_50_REGIONS: list[str] = [
    "Wayanad, Kerala, India",
    "Chamoli, Uttarakhand, India",
    "Darjeeling, West Bengal, India",
    "Cachar, Assam, India",
    "Joshimath, Uttarakhand, India",
    "Puri, Odisha, India",
    "Shimla, Himachal Pradesh, India",
    "Barmer, Rajasthan, India",
    "Kutch, Gujarat, India",
    "Leh, Ladakh, India",
    "Assam, India",
    "Bihar, India",
    "Chitwan, Nepal",
    "Gujarat, India",
    "Himachal Pradesh, India",
    "Kathmandu Valley, Nepal",
    "Mustang, Nepal",
    "Pokhara, Nepal",
    "Solukhumbu, Nepal",
    "Uttarakhand, India",
    "Visakhapatnam, Andhra Pradesh, India",
    "Itanagar, Arunachal Pradesh, India",
    "Majuli, Assam, India",
    "Darbhanga, Bihar, India",
    "Korba, Chhattisgarh, India",
    "North Goa, Goa, India",
    "Bharuch, Gujarat, India",
    "Ambala, Haryana, India",
    "Kullu, Himachal Pradesh, India",
    "Ranchi, Jharkhand, India",
    "Kodagu, Karnataka, India",
    "Idukki, Kerala, India",
    "Indore, Madhya Pradesh, India",
    "Chiplun, Maharashtra, India",
    "Imphal, Manipur, India",
    "Sohra, Meghalaya, India",
    "Aizawl, Mizoram, India",
    "Mon, Nagaland, India",
    "Kendrapara, Odisha, India",
    "Rupnagar, Punjab, India",
    "Jaisalmer, Rajasthan, India",
    "Gangtok, Sikkim, India",
    "Cuddalore, Tamil Nadu, India",
    "Bhadrachalam, Telangana, India",
    "Unakoti, Tripura, India",
    "Gorakhpur, Uttar Pradesh, India",
    "Pithoragarh, Uttarakhand, India",
    "Sundarbans, West Bengal, India",
    "Anantnag, Jammu and Kashmir, India",
    "Port Blair, Andaman and Nicobar Islands, India",
]

MAX_RETRIES: int = 3
