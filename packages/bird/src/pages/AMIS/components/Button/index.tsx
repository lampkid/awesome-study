import { Button as AntdButton } from "antd";
import ButtonGroup from "./ButtonGroup";

class Button extends AntdButton {
  static ButtonGroup: typeof ButtonGroup;
}
Button.ButtonGroup = ButtonGroup;
export default Button;
