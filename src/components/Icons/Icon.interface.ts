export interface IconProps {
    style?: Object,
    size?: number,
    // onClick?: ((e: Event) => void) | (() => void)
    onClick?: () => void | ((e: Event) => void)

}