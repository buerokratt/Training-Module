import { FC } from 'react';
import * as RadixSwitch from '@radix-ui/react-switch';

type SwitchProps = {
  onLabel: string;
  offLabel: string;
  name: string;
}

const Switch: FC<SwitchProps> = ({ onLabel, offLabel, name }) => {
  return (
    <RadixSwitch.Root>
      <RadixSwitch.Thumb />
    </RadixSwitch.Root>
  );
};

export default Switch;
