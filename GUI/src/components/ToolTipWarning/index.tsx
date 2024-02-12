import { FC, PropsWithChildren, ReactNode } from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';

import './TooltipWarning.scss';

type TooltipProps = {
    content: ReactNode;
}

const Tooltip: FC<PropsWithChildren<TooltipProps>> = ({ content, children }) => {
    return (
        <RadixTooltip.Provider delayDuration={0}>
            <RadixTooltip.Root>
                <RadixTooltip.Trigger asChild>
                    {children}
                </RadixTooltip.Trigger>
                <RadixTooltip.Portal>
                    <RadixTooltip.Content className='tooltip'>
                        {content}
                        <RadixTooltip.Arrow className='tooltip__arrow' />
                    </RadixTooltip.Content>
                </RadixTooltip.Portal>
            </RadixTooltip.Root>
        </RadixTooltip.Provider>
    );
};

export default Tooltip;
