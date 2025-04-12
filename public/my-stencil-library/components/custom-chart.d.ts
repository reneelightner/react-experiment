import type { Components, JSX } from "../types/components";

interface CustomChart extends Components.CustomChart, HTMLElement {}
export const CustomChart: {
    prototype: CustomChart;
    new (): CustomChart;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
