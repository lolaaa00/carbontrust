"""
Deploy CarbonTrust Protocol to StudioNet.

Usage:
    PYTHONIOENCODING=utf-8 .venv/bin/python scripts/deploy.py

Uses the same gltest infrastructure as the integration test. The account
used is whatever gltest resolves as the default for studionet.
"""
import json
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from gltest import get_contract_factory
from gltest.accounts import get_accounts

CONTRACT_PATH = "carbon_trust_protocol.py"


def main():
    print("Deploying CarbonTrust Protocol to StudioNet...")
    print(f"Contract: contracts/{CONTRACT_PATH}")

    factory = get_contract_factory(contract_file_path=CONTRACT_PATH)
    contract = factory.deploy(args=[])
    address = contract.address

    print(f"\nDeployed at: {address}")
    print(f"\nAdd to .env.local:")
    print(f"NEXT_PUBLIC_CONTRACT_ADDRESS={address}")
    print(f"\nAdd to .env.example:")
    print(f"NEXT_PUBLIC_CONTRACT_ADDRESS={address}")


if __name__ == "__main__":
    main()
