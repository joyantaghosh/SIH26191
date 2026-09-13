import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

API_KEY: str | None = os.getenv("GEMINI_API_KEY")
OUTPUT_DIR: Path = Path(os.getenv("OUTPUT_DIR", "./outputs/risk_zone_output_data"))
MODEL_ID: str = "gemini-2.5-flash"

DEFAULT_REGIONS: list[str] = [
    # Initial 20 regions (India & Nepal)
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
    # 30 New Indian Disaster Places (All 28-29 States/UTs)
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

# Maximum retries for validation failures before skipping a region
MAX_RETRIES: int = 3

# Rate-limit retry settings
RATE_LIMIT_MAX_RETRIES: int = 5       # max retries on 429 errors per API call
RATE_LIMIT_BASE_DELAY: int = 30       # initial backoff in seconds
RATE_LIMIT_MAX_DELAY: int = 120       # cap for exponential backoff
BETWEEN_REGION_DELAY: int = 12        # mandatory seconds to wait between processing regions
