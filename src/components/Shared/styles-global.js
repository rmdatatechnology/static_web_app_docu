import { createGlobalStyle, keyframes } from "styled-components"
import { setThemeVars } from "../../utils/theme-helper"

const globalVar = {
  primaryColor: "#fff",
  secondaryColor: "#333",
  bgColorLight: "#fff",
  bgColorDark: "#292a30",
  bgSubColorLight: "#f7f7f7",
  bgSubColorDark: "#26272e",
  headerColorLight:  "#eee",
  headerColorDark: "#252427",
  fontColorLight: "#313131",
  fontSubColorLight: "#808080",
  fontColorDark: "#d3d3dc",
  fontSubColorDark: "#a1a1a5",
  darkColor: "#333",
  midColor: "#444",
  darkerColor: "#2c2c39",
  subColor: "grey",
  lightGreyColor: "#eee",
  midGreyColor: "#ccc",
  mintColor: "#bfe2ca",
  maxWidthSite: "768px",

  // @mixin disable-selection()
  disableSelection: `-webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;`,
  curTheme: "",
}

// global variables are passed down to themes to be used in other styled components
export const theme = {
  ...globalVar,
}

let profileHomeBorder = () => setThemeVars("#ddd", "#333")

const glowing = keyframes`
    0% { background-position: 0 0; }
    50% { background-position: 400% 0; }
    100% { background-position: 0 0; }
`

const foregroundColor = () =>
  setThemeVars(theme.fontColorLight, theme.fontColorDark)

const scrollBarColor = () =>
  setThemeVars(
    "#fff",
    "#292a30"
  )

const scrollBarBg = () =>
  setThemeVars("#fff", "#292a30")
const scrollBarHover = () =>
  setThemeVars(
    "#fff",
    "#292a30"
  )

const underlineColor = () =>
  setThemeVars(
    "#fff",
    "#292a30"
  )