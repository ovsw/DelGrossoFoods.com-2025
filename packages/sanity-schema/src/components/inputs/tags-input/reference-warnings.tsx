import { Card } from "@sanity/ui";

export function ReferenceCreateWarning() {
  return (
    <Card
      padding={[3, 3, 4]}
      marginBottom={[3, 3, 4]}
      radius={2}
      shadow={1}
      tone="caution"
    >
      Tag references cannot be created inline. Set the <code>allowCreate</code>{" "}
      option to <code>false</code> to remove this warning.
    </Card>
  );
}

export function ReferencePredefinedWarning() {
  return (
    <Card
      padding={[3, 3, 4]}
      marginBottom={[3, 3, 4]}
      radius={2}
      shadow={1}
      tone="caution"
    >
      Tag references cannot have predefined tags. Remove the{" "}
      <code>predefinedTags</code> option to remove this warning.
    </Card>
  );
}
