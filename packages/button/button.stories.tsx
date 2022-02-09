import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Button } from '@rmc/button';

import '@material/button/dist/mdc.button.css';

export default { component: Button } as ComponentMeta<typeof Button>;
const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;
export const Default = Template.bind({});
Default.args = { label: 'default' };
export const Icon = Template.bind({});
Icon.args = { label: 'icon', icon: 'favorite' };
export const Raised = Template.bind({});
Raised.args = { label: 'raised', raised: true };
export const Unelevated = Template.bind({});
Unelevated.args = { label: 'unelevated', unelevated: true };
export const Outlined = Template.bind({});
Outlined.args = { label: 'outlined', outlined: true };
