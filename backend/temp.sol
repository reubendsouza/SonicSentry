// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// A simple storage contract
contract SimpleStorage {
    // State variable to store an unsigned integer value
    uint256 private storedData;

    // Event to emit when the value is changed
    event ValueChanged(uint256 newValue);

    // Function to store a value
    function set(uint256 _value) public {
        storedData = _value;
        emit ValueChanged(_value);
    }

    // Function to retrieve the stored value
    function get() public view returns (uint256) {
        return storedData;
    }
}