import emlIcon from "/public/eml-icon.svg";
import oauthIcon from "/public/oauth-icon.svg";
import smsIcon from "/public/sms-icon.svg";
import passwordsIcon from "/public/passwords-icon.svg";
import ssoIcon from "/public/sso-icon.svg";
import { LoginProduct } from "./types";

const LoginProducts: Record<string, LoginProduct> = {
  EML: {
    icon: emlIcon,
    name: "Email Magic Links",
  },
  SMS: {
    icon: smsIcon,
    name: "SMS passcodes",
  },
  OAUTH: {
    icon: oauthIcon,
    name: "OAuth",
  },
  PASSWORDS: {
    icon: passwordsIcon,
    name: "Passwords",
  },
  SSO: {
    icon: ssoIcon,
    name: "SSO",
  },
};

export default LoginProducts;
