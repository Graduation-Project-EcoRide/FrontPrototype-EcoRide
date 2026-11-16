import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from "react-native";
import { palette, radius } from "./theme";

export function Txt({
  children,
  size = 15,
  color = palette.text,
  weight = "400",
  style,
  rtl = false,
  numberOfLines,
}: {
  children: React.ReactNode;
  size?: number;
  color?: string;
  weight?: "400" | "500" | "600" | "700" | "800";
  style?: object;
  rtl?: boolean;
  numberOfLines?: number;
}) {
  return (
    <Text
      numberOfLines={numberOfLines}
      style={[
        {
          color,
          fontSize: size,
          fontWeight: weight,
          lineHeight: Math.round(size * 1.42),
          textAlign: rtl ? "right" : "left",
          writingDirection: rtl ? "rtl" : "ltr",
        },
        style,
      ]}
    >
      {children}
    </Text>
  );
}

export function Button({
  title,
  onPress,
  secondary = false,
  disabled = false,
  loading = false,
  icon,
  compact = false,
  tone = "green",
}: {
  title: string;
  onPress: () => void;
  secondary?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  compact?: boolean;
  tone?: "green" | "teal";
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled, busy: loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        tone === "teal" && styles.buttonTeal,
        secondary && styles.buttonSecondary,
        secondary && tone === "teal" && styles.buttonSecondaryTeal,
        compact && styles.buttonCompact,
        disabled && styles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={secondary ? (tone === "teal" ? palette.teal : palette.green) : "#FFFFFF"} />
      ) : (
        <>
          {icon}
          <Txt
            size={compact ? 13 : 15}
            weight="700"
            color={secondary ? (tone === "teal" ? palette.teal : palette.green) : "#FFFFFF"}
          >
            {title}
          </Txt>
        </>
      )}
    </Pressable>
  );
}

export function Field({
  label,
  rtl = false,
  multiline = false,
  ...props
}: TextInputProps & { label: string; rtl?: boolean }) {
  return (
    <View style={styles.fieldWrap}>
      <Txt size={13} weight="600" color={palette.muted} rtl={rtl}>
        {label}
      </Txt>
      <TextInput
        placeholderTextColor="#98A39A"
        accessibilityLabel={label}
        textAlign={rtl ? "right" : "left"}
        multiline={multiline}
        style={[
          styles.input,
          multiline && styles.multiline,
          rtl && { writingDirection: "rtl" },
        ]}
        {...props}
      />
    </View>
  );
}

export function Card({
  children,
  style,
  onPress,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}) {
  const content = <View style={[styles.card, style]}>{children}</View>;
  if (!onPress) return content;
  return (
    <Pressable accessibilityRole="button" onPress={onPress}>
      {content}
    </Pressable>
  );
}

export function Chip({
  label,
  tone = "green",
}: {
  label: string;
  tone?: "green" | "teal" | "amber" | "gray";
}) {
  const toneStyle = {
    green: { backgroundColor: palette.greenSoft, color: palette.green },
    teal: { backgroundColor: palette.tealSoft, color: palette.teal },
    amber: { backgroundColor: palette.warningSoft, color: palette.warning },
    gray: { backgroundColor: palette.surfaceSoft, color: palette.muted },
  }[tone];
  return (
    <View style={[styles.chip, { backgroundColor: toneStyle.backgroundColor }]}>
      <Txt size={11} weight="700" color={toneStyle.color}>
        {label}
      </Txt>
    </View>
  );
}

export function SectionTitle({
  title,
  action,
  onAction,
  rtl = false,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
  rtl?: boolean;
}) {
  return (
    <View style={[styles.section, rtl && { flexDirection: "row-reverse" }]}>
      <Txt size={19} weight="700" rtl={rtl} style={{ flex: 1 }}>
        {title}
      </Txt>
      {action && onAction ? (
        <Pressable accessibilityRole="button" onPress={onAction} hitSlop={8}>
          <Txt size={13} weight="700" color={palette.teal} rtl={rtl}>
            {action}
          </Txt>
        </Pressable>
      ) : null}
    </View>
  );
}

export function RouteLine({
  from,
  to,
  rtl = false,
}: {
  from: string;
  to: string;
  rtl?: boolean;
}) {
  return (
    <View style={[styles.route, rtl && { flexDirection: "row-reverse" }]}>
      <View style={styles.routeDots}>
        <View style={styles.routeDotStart} />
        <View style={styles.routeDash} />
        <View style={styles.routeDotEnd} />
      </View>
      <View style={{ flex: 1, gap: 12 }}>
        <Txt size={13} color={palette.muted} rtl={rtl} numberOfLines={1}>
          {from}
        </Txt>
        <Txt size={14} weight="600" rtl={rtl} numberOfLines={2}>
          {to}
        </Txt>
      </View>
    </View>
  );
}

export function Notice({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.notice}>
      <Txt size={12} color="#315B3B" weight="500">
        {children}
      </Txt>
    </View>
  );
}

export function PageScroll({
  children,
  rtl = false,
}: {
  children: React.ReactNode;
  rtl?: boolean;
}) {
  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.pageScroll, rtl && { direction: "rtl" }]}
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    paddingHorizontal: 20,
    borderRadius: radius.pill,
    backgroundColor: palette.green,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  buttonSecondary: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: palette.green,
  },
  buttonTeal: {
    backgroundColor: palette.teal,
  },
  buttonSecondaryTeal: {
    borderColor: palette.teal,
  },
  buttonCompact: {
    minHeight: 42,
    paddingHorizontal: 15,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },
  fieldWrap: {
    gap: 7,
  },
  input: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: palette.line,
    borderRadius: radius.pill,
    paddingHorizontal: 17,
    backgroundColor: "#FFFFFF",
    color: palette.text,
    fontSize: 15,
  },
  multiline: {
    minHeight: 110,
    paddingTop: 14,
    borderRadius: radius.medium,
    textAlignVertical: "top",
  },
  card: {
    backgroundColor: palette.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: "#E6ECE6",
    padding: 18,
    gap: 14,
    shadowColor: "#0B3D2E",
    shadowOpacity: 0.035,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radius.pill,
    alignSelf: "flex-start",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },
  route: {
    flexDirection: "row",
    gap: 13,
    alignItems: "stretch",
  },
  routeDots: {
    width: 12,
    alignItems: "center",
    paddingTop: 4,
  },
  routeDotStart: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: palette.green,
  },
  routeDash: {
    width: 1,
    height: 20,
    borderStyle: "dashed",
    borderLeftWidth: 1,
    borderColor: "#9BB8A2",
  },
  routeDotEnd: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: palette.teal,
    backgroundColor: "#FFFFFF",
  },
  notice: {
    borderRadius: radius.medium,
    backgroundColor: "#EEF7EF",
    borderWidth: 1,
    borderColor: "#D9ECDC",
    padding: 13,
  },
  pageScroll: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 26,
    gap: 16,
  },
});
