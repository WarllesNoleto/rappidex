
import styled from 'styled-components'
import { Colors, LoaderProps } from '.'

export const SpanLoader = styled.span<LoaderProps>`
    & {
        width: ${(props) => props.size}px;
        height: ${(props) => props.size}px;
        border-radius: 50%;
        position: relative;
        animation: rotate 1s linear infinite
    }
    &:before , &:after {
        content: "";
        box-sizing: border-box;
        position: absolute;
        inset: 0px;
        border-radius: 50%;
        border: ${(props) => (props.size * 5) / 40}px solid ${(props) => props.theme[Colors[props.biggestColor]]};
        animation: prixClipFix 2s linear infinite ;
    }
    &:after{
        inset: ${(props) => (props.size * 8) / 40}px;
        transform: rotate3d(90, 90, 0, 180deg );
        border-color: ${(props) => props.theme[Colors[props.smallestColor]]};
    }

    @keyframes rotate {
        0%   {transform: rotate(0deg)}
        100%   {transform: rotate(360deg)}
    }

    @keyframes prixClipFix {
        0%   {clip-path:polygon(50% 50%,0 0,0 0,0 0,0 0,0 0)}
        50%  {clip-path:polygon(50% 50%,0 0,100% 0,100% 0,100% 0,100% 0)}
        75%, 100%  {clip-path:polygon(50% 50%,0 0,100% 0,100% 100%,100% 100%,100% 100%)}
    }
`
