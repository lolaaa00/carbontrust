"""Shared test helpers for direct-mode contract tests.

genlayer-test's direct_vm/direct_deploy fixtures hand back raw address bytes
(direct_owner, direct_alice, etc. are `bytes`, not the checksummed hex string
the contract sees via `str(gl.message.sender_address)`). Comparing a fixture
address to a contract-stored owner string needs both sides normalized to the
same EIP-55 checksummed form.
"""

from eth_utils import to_checksum_address


def addr(value) -> str:
    """Normalize a fixture address (bytes) or an Address-like object to the
    same checksummed hex string the contract stores via str(sender_address)."""
    if isinstance(value, (bytes, bytearray)):
        return to_checksum_address(bytes(value))
    return to_checksum_address(str(value))
