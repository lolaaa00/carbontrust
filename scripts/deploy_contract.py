"""
Deploy CarbonTrust Protocol to StudioNet via pytest.
Run: PYTHONIOENCODING=utf-8 .venv/bin/python -m pytest scripts/deploy_contract.py -v -s --network studionet
"""
from gltest import get_contract_factory


def test_deploy():
    factory = get_contract_factory(contract_file_path="carbon_trust_protocol.py")
    contract = factory.deploy(args=[])
    address = contract.address

    print(f"\n\n{'='*60}")
    print(f"DEPLOYED CONTRACT ADDRESS:")
    print(f"{address}")
    print(f"{'='*60}")
    print(f"\nUpdate .env.local:")
    print(f"NEXT_PUBLIC_CONTRACT_ADDRESS={address}")
    print(f"\nUpdate .env.example:")
    print(f"NEXT_PUBLIC_CONTRACT_ADDRESS={address}\n")

    assert address and address.startswith("0x"), f"Expected valid address, got: {address}"
