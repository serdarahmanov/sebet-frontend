import { StyleSheet, Text, View } from "react-native";

type SummaryRow = {
  label: string;
  value: string;
  highlight?: boolean;
  saving?: boolean;
};

type SummaryProps = {
  subtotal: number;
  savings: number;
  deliveryFee: number;
  total: number;
};

export default function Summary({
  subtotal,
  savings,
  deliveryFee,
  total,
}: SummaryProps) {
  const rows: SummaryRow[] = [
    { label: "Subtotal", value: `£${subtotal.toFixed(2)}` },
    { label: "Savings", value: `-£${savings.toFixed(2)}`, saving: true },
    { label: "Delivery", value: deliveryFee === 0 ? "Free" : `£${deliveryFee.toFixed(2)}` },
    { label: "Total", value: `£${total.toFixed(2)}`, highlight: true },
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Summary</Text>
      <View style={styles.box}>
        {rows.map((row, index) => (
          <View key={row.label}>
            <View style={styles.row}>
              <Text style={[styles.label, row.highlight && styles.labelBold]}>
                {row.label}
              </Text>
              <Text
                style={[
                  styles.value,
                  row.highlight && styles.valueBold,
                  row.saving && styles.valueSaving,
                ]}
              >
                {row.value}
              </Text>
            </View>
            {index < rows.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 24,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 12,
  },
  box: {
    backgroundColor: "#fff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#EEEEEE",
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
  },
  label: {
    fontSize: 14,
    color: "#555555",
    fontWeight: "400",
  },
  labelBold: {
    fontWeight: "700",
    color: "#1A1A1A",
    fontSize: 15,
  },
  value: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  valueBold: {
    fontSize: 16,
    fontWeight: "700",
  },
  valueSaving: {
    color: "#2E7D32",
  },
});
