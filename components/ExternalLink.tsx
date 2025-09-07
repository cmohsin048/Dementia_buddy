import { openBrowserAsync } from "expo-web-browser";
import { Platform, Text, TouchableOpacity } from "react-native";

type Props = {
  href: string;
  children: React.ReactNode;
  style?: any;
};

export function ExternalLink({ href, children, style }: Props) {
  return (
    <TouchableOpacity
      style={style}
      onPress={async () => {
        if (Platform.OS !== "web") {
          // Open the link in an in-app browser.
          await openBrowserAsync(href);
        } else {
          // For web, open in new tab
          window.open(href, "_blank");
        }
      }}
    >
      <Text>{children}</Text>
    </TouchableOpacity>
  );
}
