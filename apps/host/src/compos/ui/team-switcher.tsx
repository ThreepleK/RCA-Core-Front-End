import React, { useState } from 'react'
import { Input, InputBase, Combobox, useCombobox } from '@mantine/core';

const TEAM_LIST = [
  { key:'teamA', name: '🍎 Team A' },
  { key:'teamB', name: '🥕 Team B' },
  { key:'teamC', name: '🥦 Team C' },
];

export const TeamSwitcher = () => {
  const [value, setValue] = useState<string | null>(null);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });
  
  const options = TEAM_LIST.map(({name, key}) => (
    <Combobox.Option value={name} key={key}>{name}</Combobox.Option>
  ))

  return (
    <Combobox
      store={combobox}
      onOptionSubmit={(val) => {
        setValue(val);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          rightSectionPointerEvents="none"
          onClick={() => combobox.toggleDropdown()}
        >
          {value || <Input.Placeholder>Pick Team</Input.Placeholder>}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  )
}
