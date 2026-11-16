import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import {
  Button,
  Card,
  Chip,
  Field,
  Notice,
  PageScroll,
  RouteLine,
  SectionTitle,
  Txt,
} from "./src/components";
import { sampleBookings, sampleRides, sampleTransactions } from "./src/fixtures";
import { demoOnly, integrationStatus } from "./src/services/ecoRideApi";
import { palette, radius } from "./src/theme";
import type { Ride, ScreenId } from "./src/types";

const tr = (rtl: boolean, en: string, ar: string) => (rtl ? ar : en);

const screenTitles: Partial<Record<ScreenId, [string, string]>> = {
  rideDetail: ["Ride details", "تفاصيل الرحلة"],
  booking: ["Booking preview", "معاينة الحجز"],
  wallet: ["Wallet", "المحفظة"],
  alerts: ["Notifications", "الإشعارات"],
  profile: ["Personal information", "المعلومات الشخصية"],
  security: ["Password & security", "كلمة المرور والأمان"],
  support: ["Help & support", "المساعدة والدعم"],
  history: ["Ride history", "سجل الرحلات"],
  driverApply: ["Become a driver", "انضم كسائق"],
  offerRide: ["Create a ride", "إنشاء رحلة"],
  requests: ["Passenger requests", "طلبات الركاب"],
  chat: ["Messages", "الرسائل"],
};

type TabTarget = "home" | "rides" | "map" | "settings" | "driverHome" | "requests" | "chat";

function AppIcon({
  name,
  color = palette.teal,
  size = 20,
}: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color?: string;
  size?: number;
}) {
  return <Ionicons name={name} color={color} size={size} />;
}

function BrandMark({ dark = false }: { dark?: boolean }) {
  return (
    <View style={styles.brandLockup}>
      <View style={[styles.brandLeaf, dark && { backgroundColor: palette.mint }]}>
        <AppIcon name="leaf" color={dark ? palette.teal : "#FFFFFF"} size={18} />
      </View>
      <Txt size={30} weight="800" color={dark ? "#FFFFFF" : palette.green}>
        EcoRide
      </Txt>
    </View>
  );
}

function Avatar({
  initials,
  size = 42,
  tone = "green",
}: {
  initials: string;
  size?: number;
  tone?: "green" | "teal";
}) {
  return (
    <View
      style={[
        styles.avatar,
        { width: size, height: size, borderRadius: size / 2 },
        tone === "teal" && { backgroundColor: palette.tealSoft },
      ]}
    >
      <Txt size={size * 0.3} weight="800" color={tone === "teal" ? palette.teal : palette.green}>
        {initials}
      </Txt>
    </View>
  );
}

function DemoBadge({ rtl = false }: { rtl?: boolean }) {
  return (
    <View style={[styles.demoBadge, rtl && { flexDirection: "row-reverse" }]}>
      <View style={styles.demoDot} />
      <Txt size={11} weight="700" color="#426349" rtl={rtl}>
        {tr(rtl, "Demo preview · no backend connected", "نسخة تجريبية · لا يوجد اتصال بالخادم")}
      </Txt>
    </View>
  );
}

function RideCard({
  ride,
  rtl,
  onOpen,
}: {
  ride: Ride;
  rtl: boolean;
  onOpen: () => void;
}) {
  return (
    <Card>
      <View style={[styles.rideTop, rtl && { flexDirection: "row-reverse" }]}>
        <View style={[styles.person, rtl && { flexDirection: "row-reverse" }]}>
          <Avatar initials={ride.initials} />
          <View style={{ flex: 1 }}>
            <Txt size={15} weight="700" rtl={rtl}>
              {ride.driver}
            </Txt>
            <Txt size={12} color={palette.muted} rtl={rtl}>
              ★ {ride.rating} · {ride.trips} {tr(rtl, "rides", "رحلة")}
            </Txt>
          </View>
        </View>
        <Chip label={ride.co2} />
      </View>
      <Txt size={12} weight="600" color={palette.muted} rtl={rtl}>
        {ride.time}
      </Txt>
      <RouteLine from={ride.from} to={ride.to} rtl={rtl} />
      <View style={[styles.rideBottom, rtl && { flexDirection: "row-reverse" }]}>
        <View>
          <Txt size={23} weight="800" color={palette.green}>
            {ride.price} JOD
          </Txt>
          <Txt size={11} color={palette.muted} rtl={rtl}>
            {tr(rtl, `Seats ${ride.seats}`, `المقاعد ${ride.seats}`)}
          </Txt>
        </View>
        <Button
          title={tr(rtl, "View ride", "عرض الرحلة")}
          compact
          onPress={onOpen}
        />
      </View>
    </Card>
  );
}

function BottomTabs({
  current,
  driver,
  rtl,
  onSelect,
}: {
  current: ScreenId;
  driver: boolean;
  rtl: boolean;
  onSelect: (target: TabTarget) => void;
}) {
  const tabs: {
    id: TabTarget;
    label: string;
    labelAr: string;
    icon: React.ComponentProps<typeof Ionicons>["name"];
    activeIcon: React.ComponentProps<typeof Ionicons>["name"];
  }[] = driver
    ? [
        { id: "driverHome", label: "Home", labelAr: "الرئيسية", icon: "home-outline", activeIcon: "home" },
        { id: "chat", label: "Messages", labelAr: "الرسائل", icon: "chatbubble-outline", activeIcon: "chatbubble" },
        { id: "map", label: "Map", labelAr: "الخريطة", icon: "map-outline", activeIcon: "map" },
        { id: "settings", label: "Settings", labelAr: "الإعدادات", icon: "settings-outline", activeIcon: "settings" },
      ]
    : [
        { id: "home", label: "Home", labelAr: "الرئيسية", icon: "home-outline", activeIcon: "home" },
        { id: "rides", label: "Rides", labelAr: "الرحلات", icon: "car-outline", activeIcon: "car" },
        { id: "map", label: "Map", labelAr: "الخريطة", icon: "map-outline", activeIcon: "map" },
        { id: "settings", label: "Settings", labelAr: "الإعدادات", icon: "settings-outline", activeIcon: "settings" },
      ];

  const activeTarget = current === "driverHome" || current === "requests" ? current : current;
  return (
    <View style={[styles.tabBar, rtl && { flexDirection: "row-reverse" }]}>
      {tabs.map((tab) => {
        const active = activeTarget === tab.id;
        const selectedIcon = active ? tab.activeIcon : tab.icon;
        return (
          <Pressable
            key={tab.id}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={tr(rtl, tab.label, tab.labelAr)}
            onPress={() => onSelect(tab.id)}
            style={[styles.tabItem, active && styles.tabItemActive]}
          >
            <AppIcon
              name={selectedIcon}
              size={20}
              color={active ? "#FFFFFF" : palette.muted}
            />
            <Txt
              size={10}
              weight={active ? "700" : "500"}
              color={active ? "#FFFFFF" : palette.muted}
            >
              {tr(rtl, tab.label, tab.labelAr)}
            </Txt>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function App() {
  const [screen, setScreen] = useState<ScreenId>("login");
  const [history, setHistory] = useState<ScreenId[]>([]);
  const [notice, setNotice] = useState("");
  const [rtl, setRtl] = useState(false);
  const [isDriver, setIsDriver] = useState(false);
  const [userName, setUserName] = useState("Maya Al-Salem");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [otp, setOtp] = useState("");
  const otpInputRef = useRef<TextInput>(null);
  const [otpPurpose, setOtpPurpose] = useState<"signup" | "forgot">("signup");
  const [resendSeconds, setResendSeconds] = useState(60);
  const [otpExpirySeconds, setOtpExpirySeconds] = useState(300);
  const [resetStage, setResetStage] = useState<0 | 2>(0);
  const [searchDone, setSearchDone] = useState(false);
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [selectedRide, setSelectedRide] = useState<Ride>(sampleRides[0]);
  const [chatDraft, setChatDraft] = useState("");
  const [chatMessages, setChatMessages] = useState([
    { by: "Sam K.", text: "I’ll be at the north entrance.", mine: false },
    { by: "You", text: "Thanks, I’ll look for you there.", mine: true },
  ]);
  const [vehicleType, setVehicleType] = useState<"Electric" | "Hybrid">("Electric");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [documentCount, setDocumentCount] = useState(0);
  const [ridePublishedLocally, setRidePublishedLocally] = useState(false);
  const [rideFrom, setRideFrom] = useState("");
  const [rideTo, setRideTo] = useState("");
  const [seatCount, setSeatCount] = useState("3");
  const [evidenceAdded, setEvidenceAdded] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [messageCount, setMessageCount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"Wallet" | "Cash">("Wallet");
  const [supportCategory, setSupportCategory] = useState("Ride");
  const [supportDescription, setSupportDescription] = useState("");
  const [supportEvidence, setSupportEvidence] = useState(false);
  const [twoFactorPreview, setTwoFactorPreview] = useState(true);

  useEffect(() => {
    if (screen !== "otp") return;
    setResendSeconds(60);
    setOtpExpirySeconds(300);
    const timer = setInterval(() => {
      setResendSeconds((remaining) => (remaining > 0 ? remaining - 1 : 0));
      setOtpExpirySeconds((remaining) => (remaining > 0 ? remaining - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [screen]);

  const go = (next: ScreenId) => {
    setNotice("");
    setHistory((current) => [...current, screen]);
    setScreen(next);
  };

  const tabTo = (next: TabTarget) => {
    setNotice("");
    setHistory([]);
    setScreen(next);
    if (next === "driverHome" || next === "requests") setIsDriver(true);
  };

  const back = () => {
    setNotice("");
    if (history.length === 0) {
      setScreen(isDriver ? "driverHome" : "home");
      return;
    }
    setScreen(history[history.length - 1]);
    setHistory(history.slice(0, -1));
  };

  const previewAction = (label: string) => setNotice(demoOnly(label));

  const login = () => {
    if (phone.trim().length < 7 || password.length < 6) {
      setNotice(
        tr(
          rtl,
          "Enter a phone number and a password with at least 6 characters.",
          "أدخل رقم هاتف وكلمة مرور من 6 أحرف على الأقل.",
        ),
      );
      return;
    }
    setUserName(fullName.trim() || "Maya Al-Salem");
    setNotice("");
    setHistory([]);
    setScreen(isDriver ? "driverHome" : "home");
    setNotice(demoOnly("Local demo session opened"));
  };

  const doSearch = () => {
    if (!pickup.trim() || !dropoff.trim()) {
      setNotice(tr(rtl, "Add both pickup and drop-off locations first.", "أضف موقع الانطلاق والوجهة أولاً."));
      return;
    }
    setSearchDone(true);
    setNotice(tr(rtl, "Showing sample rides for this preview.", "تُعرض رحلات تجريبية في هذه المعاينة."));
  };

  const openRide = (ride: Ride) => {
    setSelectedRide(ride);
    go("rideDetail");
  };

  const submitOtp = () => {
    if (otpExpirySeconds === 0) {
      setNotice(tr(rtl, "This preview code expired. Resend to restart the timer.", "انتهت صلاحية الرمز التجريبي. أعد الإرسال لإعادة تشغيل المؤقت."));
      return;
    }
    if (!/^\d{5}$/.test(otp)) {
      setNotice(tr(rtl, "Enter the 5-digit preview code.", "أدخل الرمز التجريبي المكوّن من 5 أرقام."));
      return;
    }
    setNotice("");
    if (otpPurpose === "forgot") {
      setResetStage(2);
      setScreen("forgot");
      setHistory([]);
      return;
    }
    setUserName(fullName.trim() || "Maya Al-Salem");
    setHistory([]);
    setScreen("home");
    setNotice(demoOnly("Registration flow previewed; account was not created"));
  };

  const sendChat = () => {
    const message = chatDraft.trim();
    if (!message) return;
    if (message.length > 1000) {
      setNotice(tr(rtl, "Messages are limited to 1,000 characters.", "الرسالة لا تتجاوز 1000 حرف."));
      return;
    }
    setChatMessages((current) => [...current, { by: "You", text: message, mine: true }]);
    setChatDraft("");
    setMessageCount((count) => count + 1);
    setNotice(demoOnly("Message added to this local preview"));
  };

  const toggleDriver = () => {
    const nextDriver = !isDriver;
    setIsDriver(nextDriver);
    setHistory([]);
    setNotice(demoOnly("Role switch shown for preview; driver approval is not verified"));
    setScreen(nextDriver ? "driverHome" : "home");
  };

  const toggleLanguage = () => {
    setRtl((current) => !current);
    setNotice("");
  };

  const showBack = !["login", "signup", "forgot", "otp", "home", "rides", "map", "settings", "driverHome", "requests"].includes(screen);
  const titlePair = screenTitles[screen];
  const headerTitle = titlePair ? tr(rtl, titlePair[0], titlePair[1]) : "EcoRide";
  const showTabs =
    ["home", "rides", "map", "settings", "driverHome", "requests"].includes(screen) ||
    (screen === "chat" && isDriver);

  const renderAuth = () => (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={[styles.authPage, rtl && { direction: "rtl" }]}
      showsVerticalScrollIndicator={false}
    >
      {screen === "login" ? (
        <View style={styles.authBrand}>
          <BrandMark />
          <Txt size={15} color={palette.muted} style={{ textAlign: "center", marginTop: 6 }}>
            {tr(rtl, "Shared journeys, lighter footprints.", "رحلات مشتركة وأثر بيئي أقل.")}
          </Txt>
        </View>
      ) : (
        <View style={[styles.authHeader, rtl && { alignItems: "flex-end" }]}>
          <Pressable accessibilityRole="button" onPress={back} style={styles.backButton}>
            <AppIcon name={rtl ? "arrow-forward" : "arrow-back"} />
          </Pressable>
          <Txt size={26} weight="800" color={palette.teal} rtl={rtl}>
            {screen === "signup"
              ? tr(rtl, "Create your account", "أنشئ حسابك")
              : screen === "otp"
                ? tr(rtl, "Verify your phone", "تحقق من هاتفك")
                : tr(rtl, resetStage === 2 ? "Set a new password" : "Reset password", resetStage === 2 ? "أنشئ كلمة مرور جديدة" : "إعادة تعيين كلمة المرور")}
          </Txt>
          <Txt size={14} color={palette.muted} rtl={rtl}>
            {screen === "otp"
              ? tr(rtl, "Enter the 5-digit code to continue.", "أدخل الرمز المكوّن من 5 أرقام للمتابعة.")
              : screen === "signup"
                ? tr(rtl, "Your account details stay on this device in demo mode.", "تبقى بياناتك على هذا الجهاز في الوضع التجريبي.")
                : screen === "forgot" && resetStage === 2
                  ? tr(rtl, "This preview does not change a real account.", "هذه المعاينة لا تغيّر حساباً حقيقياً.")
                  : tr(rtl, "Use the existing authentication service when it is connected.", "استخدم خدمة المصادقة الحالية عند ربطها.")}
          </Txt>
        </View>
      )}

      {screen === "login" ? (
        <View style={styles.authForm}>
          <Field
            label={tr(rtl, "Phone number", "رقم الهاتف")}
            placeholder="+962 00 000 0000"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            rtl={rtl}
            textContentType="telephoneNumber"
          />
          <Field
            label={tr(rtl, "Password", "كلمة المرور")}
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            rtl={rtl}
            textContentType="password"
          />
          <Button title={tr(rtl, "Login", "تسجيل الدخول")} onPress={login} />
          <Pressable
            onPress={() => {
              setResetStage(0);
              go("forgot");
            }}
            style={styles.centerLink}
          >
            <Txt size={14} weight="600" color={palette.teal}>
              {tr(rtl, "Forgot password?", "هل نسيت كلمة المرور؟")}
            </Txt>
          </Pressable>
          <Pressable onPress={() => go("signup")} style={styles.centerLink}>
            <Txt size={15} weight="700" color={palette.text}>
              {tr(rtl, "Sign up", "إنشاء حساب")}
            </Txt>
          </Pressable>
          <Notice>{tr(rtl, "The real service locks sign-in for 10 minutes after five failed attempts; lock status requires the backend.", "يقفل النظام الفعلي تسجيل الدخول 10 دقائق بعد خمس محاولات فاشلة؛ حالة القفل تتطلب الخادم.")}</Notice>
          <DemoBadge rtl={rtl} />
        </View>
      ) : screen === "signup" ? (
        <View style={styles.authForm}>
          <Field
            label={tr(rtl, "Full name", "الاسم الكامل")}
            placeholder={tr(rtl, "Your name", "اسمك")}
            value={fullName}
            onChangeText={setFullName}
            rtl={rtl}
            autoComplete="name"
          />
          <Field
            label={tr(rtl, "Phone number", "رقم الهاتف")}
            placeholder="+962 00 000 0000"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            rtl={rtl}
          />
          <Field
            label={tr(rtl, "Password", "كلمة المرور")}
            placeholder={tr(rtl, "At least 6 characters", "6 أحرف على الأقل")}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            rtl={rtl}
          />
          <Button
            title={tr(rtl, "Continue", "متابعة")}
            onPress={() => {
              if (fullName.trim().length < 2 || phone.trim().length < 7 || password.length < 6) {
                setNotice(tr(rtl, "Complete all fields; password needs 6+ characters.", "أكمل الحقول؛ يجب أن تتكون كلمة المرور من 6 أحرف على الأقل."));
                return;
              }
              setOtpPurpose("signup");
              setOtp("");
              setNotice("");
              go("otp");
            }}
          />
          <Notice>{tr(rtl, "Preview only: OTP delivery is not configured, so no code is sent.", "معاينة فقط: لم يتم إعداد إرسال الرمز، لذلك لن يُرسل رمز.")}</Notice>
        </View>
      ) : screen === "otp" ? (
        <View style={styles.authForm}>
          <View style={styles.otpField}>
            <Txt size={13} weight="600" color={palette.muted} rtl={rtl}>
              {tr(rtl, "5-digit verification code", "رمز التحقق المكوّن من 5 أرقام")}
            </Txt>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={tr(rtl, "Enter the 5-digit code", "أدخل الرمز المكوّن من 5 أرقام")}
              onPress={() => otpInputRef.current?.focus()}
              style={styles.otpRow}
            >
              {Array.from({ length: 5 }, (_, index) => (
                <View key={index} style={[styles.otpCell, otp[index] ? styles.otpCellFilled : null]}>
                  <Txt size={20} weight="700" color={palette.teal}>{otp[index] || ""}</Txt>
                </View>
              ))}
              <TextInput
                ref={otpInputRef}
                value={otp}
                onChangeText={(value) => setOtp(value.replace(/\D/g, "").slice(0, 5))}
                keyboardType="number-pad"
                maxLength={5}
                accessibilityLabel={tr(rtl, "Verification code", "رمز التحقق")}
                style={styles.otpHiddenInput}
              />
            </Pressable>
          </View>
          <Button title={tr(rtl, "Verify", "تحقق")} onPress={submitOtp} />
          <View style={styles.centerLink}>
            <Txt size={13} color={palette.muted} style={{ textAlign: "center" }}>
              {resendSeconds > 0
                ? tr(rtl, `Resend available in ${resendSeconds}s`, `إعادة الإرسال بعد ${resendSeconds} ث`)
                : tr(rtl, "Resend code", "إعادة إرسال الرمز")}
            </Txt>
          </View>
          <Txt size={12} color={palette.muted} style={{ textAlign: "center" }}>
            {tr(rtl, `Code expires in ${Math.floor(otpExpirySeconds / 60)}:${String(otpExpirySeconds % 60).padStart(2, "0")}`, `تنتهي صلاحية الرمز خلال ${Math.floor(otpExpirySeconds / 60)}:${String(otpExpirySeconds % 60).padStart(2, "0")}`)}
          </Txt>
          {resendSeconds === 0 ? (
            <Pressable
              onPress={() => {
                setResendSeconds(60);
                setOtpExpirySeconds(300);
                previewAction("OTP resend previewed; no code was sent");
              }}
              style={styles.centerLink}
            >
              <Txt size={14} weight="700" color={palette.green}>
                {tr(rtl, "Resend code", "إعادة إرسال الرمز")}
              </Txt>
            </Pressable>
          ) : null}
          <Notice>{tr(rtl, "Demo preview: any five digits continue locally; no OTP was verified.", "معاينة تجريبية: أي خمسة أرقام تتابع محلياً؛ لم يتم التحقق من رمز فعلي.")}</Notice>
        </View>
      ) : (
        <View style={styles.authForm}>
          {resetStage === 0 ? (
            <>
              <Field
                label={tr(rtl, "Phone number", "رقم الهاتف")}
                placeholder="+962 00 000 0000"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                rtl={rtl}
              />
              <Button
                title={tr(rtl, "Continue", "متابعة")}
                onPress={() => {
                  if (phone.trim().length < 7) {
                    setNotice(tr(rtl, "Enter a valid phone number.", "أدخل رقم هاتف صحيحاً."));
                    return;
                  }
                  setOtpPurpose("forgot");
                  setOtp("");
                  go("otp");
                }}
              />
            </>
          ) : (
            <>
              <Field
                label={tr(rtl, "New password", "كلمة المرور الجديدة")}
                placeholder={tr(rtl, "12+ characters", "12 حرفاً على الأقل")}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                rtl={rtl}
              />
              <Field
                label={tr(rtl, "Confirm new password", "تأكيد كلمة المرور الجديدة")}
                placeholder={tr(rtl, "Re-enter new password", "أعد إدخال كلمة المرور")}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                rtl={rtl}
              />
              <Notice>{tr(rtl, "Use 12+ characters with uppercase and lowercase letters, a number, and a symbol.", "استخدم 12 حرفاً على الأقل مع أحرف كبيرة وصغيرة ورقم ورمز.")}</Notice>
              <Button
                title={tr(rtl, "Save new password", "حفظ كلمة المرور")}
                onPress={() => {
                  const strongPassword =
                    password.length >= 12 &&
                    /[a-z]/.test(password) &&
                    /[A-Z]/.test(password) &&
                    /\d/.test(password) &&
                    /[^A-Za-z0-9]/.test(password);
                  if (!strongPassword || password !== confirmPassword) {
                    setNotice(tr(rtl, "Use the required password format and make both fields match.", "استخدم تنسيق كلمة المرور المطلوب وتأكد من تطابق الحقلين."));
                    return;
                  }
                  setScreen("login");
                  setHistory([]);
                  setResetStage(0);
                  setConfirmPassword("");
                  setNotice(demoOnly("Password reset previewed; no account was changed"));
                }}
              />
            </>
          )}
          <Notice>{tr(rtl, "Password recovery is not connected to an authentication provider.", "استعادة كلمة المرور غير مرتبطة بمزوّد مصادقة.")}</Notice>
        </View>
      )}
      {notice ? <Notice>{notice}</Notice> : null}
      {screen !== "login" ? (
        <Pressable onPress={toggleLanguage} style={styles.authLanguage}>
          <AppIcon name="language-outline" />
          <Txt size={13} weight="600" color={palette.teal}>
            {rtl ? "English" : "العربية"}
          </Txt>
        </Pressable>
      ) : null}
    </ScrollView>
  );

  const renderHome = () => (
    <PageScroll rtl={rtl}>
      <View style={[styles.greetingRow, rtl && { flexDirection: "row-reverse" }]}>
        <View style={{ flex: 1 }}>
          <Txt size={13} color={palette.muted} rtl={rtl}>
            {tr(rtl, "Good morning,", "صباح الخير،")}
          </Txt>
          <Txt size={23} weight="800" color={palette.teal} rtl={rtl}>
            {userName.split(" ")[0]}
          </Txt>
        </View>
        <Pressable
          accessibilityLabel={tr(rtl, "Notifications", "الإشعارات")}
          accessibilityRole="button"
          onPress={() => go("alerts")}
          style={styles.iconButton}
        >
          <AppIcon name="notifications-outline" />
          <View style={styles.notificationDot} />
        </Pressable>
      </View>
      <Card style={styles.walletCard}>
        <View style={[styles.walletHeader, rtl && { flexDirection: "row-reverse" }]}>
          <View style={{ flex: 1 }}>
            <Txt size={12} weight="600" color="#E7F5EA" rtl={rtl}>
              {tr(rtl, "AVAILABLE BALANCE", "الرصيد المتاح")}
            </Txt>
            <Txt size={27} weight="800" color="#FFFFFF">
              12.50 JOD
            </Txt>
          </View>
          <View style={styles.walletIcon}>
            <AppIcon name="wallet-outline" color={palette.green} size={21} />
          </View>
        </View>
        <Button
          title={tr(rtl, "Charge account", "شحن المحفظة")}
          secondary
          onPress={() => go("wallet")}
          icon={<AppIcon name="add-circle-outline" color={palette.green} size={18} />}
        />
      </Card>
      <DemoBadge rtl={rtl} />
      <SectionTitle
        title={tr(rtl, "Booked rides", "الرحلات المحجوزة")}
        action={tr(rtl, "View all", "عرض الكل")}
        rtl={rtl}
        onAction={() => go("history")}
      />
      {sampleBookings.map((booking) => (
        <Card key={booking.driver}>
          <View style={[styles.rideTop, rtl && { flexDirection: "row-reverse" }]}>
            <View style={[styles.person, rtl && { flexDirection: "row-reverse" }]}>
              <Avatar initials={booking.driver.split(" ").map((part) => part[0]).join("")} />
              <View style={{ flex: 1 }}>
                <Txt size={17} weight="700" rtl={rtl}>
                  {booking.driver}
                </Txt>
                <Txt size={12} color={palette.muted}>
                  ★ {booking.rating} · {tr(rtl, `Seats ${booking.seats}`, `المقاعد ${booking.seats}`)}
                </Txt>
              </View>
            </View>
            <Chip label={booking.status === "Pending" ? tr(rtl, "Pending", "قيد الانتظار") : tr(rtl, "Booked", "محجوزة")} tone={booking.status === "Pending" ? "amber" : "green"} />
          </View>
          <Chip label={booking.co2} />
          <RouteLine from={`${booking.time} · ${booking.from}`} to={booking.to} rtl={rtl} />
          <View style={[styles.buttonRow, rtl && { flexDirection: "row-reverse" }]}>
            <Button
              title={booking.status === "Pending" ? tr(rtl, "Chat after acceptance", "المراسلة بعد القبول") : tr(rtl, "Message driver", "مراسلة السائق")}
              compact
              secondary
              disabled={booking.status === "Pending"}
              onPress={() => booking.status === "Pending" ? undefined : go("chat")}
              icon={<AppIcon name="chatbubble-outline" color={palette.green} size={16} />}
            />
            <Button
              title={tr(rtl, "Cancel", "إلغاء")}
              compact
              secondary
              onPress={() => previewAction("Cancellation preview; backend outcome not available")}
            />
          </View>
        </Card>
      ))}
      <Button
        title={tr(rtl, "Find a ride", "ابحث عن رحلة")}
        onPress={() => tabTo("rides")}
        icon={<AppIcon name="search-outline" color="#FFFFFF" size={18} />}
      />
      <Button
        title={tr(rtl, "View ride history", "عرض سجل الرحلات")}
        secondary
        onPress={() => go("history")}
      />
    </PageScroll>
  );

  const renderRides = () => (
    <PageScroll rtl={rtl}>
      <View>
        <Txt size={24} weight="800" color={palette.teal} rtl={rtl}>
          {tr(rtl, "Find a ride", "ابحث عن رحلة")}
        </Txt>
        <Txt size={14} color={palette.muted} rtl={rtl}>
          {tr(rtl, "Share a scheduled trip and save together.", "شارك رحلة مجدولة ووفروا معاً.")}
        </Txt>
      </View>
      <Card>
        <Field
          label={tr(rtl, "Pick-up location", "موقع الانطلاق")}
          placeholder={tr(rtl, "Where from?", "من أين؟")}
          value={pickup}
          onChangeText={setPickup}
          rtl={rtl}
        />
        <Field
          label={tr(rtl, "Drop-off location", "الوجهة")}
          placeholder={tr(rtl, "Where to?", "إلى أين؟")}
          value={dropoff}
          onChangeText={setDropoff}
          rtl={rtl}
        />
        <Button
          title={tr(rtl, "Search rides", "ابحث عن رحلات")}
          onPress={doSearch}
          icon={<AppIcon name="search-outline" color="#FFFFFF" size={18} />}
        />
        <Txt size={12} color={palette.muted} rtl={rtl}>
          {tr(rtl, "The app shows sample results here until a ride-search API is provided.", "تظهر نتائج تجريبية هنا إلى حين توفير واجهة البحث عن الرحلات.")}
        </Txt>
      </Card>
      {searchDone ? (
        <>
          <SectionTitle title={tr(rtl, "Matching rides", "الرحلات المطابقة")} rtl={rtl} />
          {sampleRides.map((ride) => (
            <RideCard key={ride.id} ride={ride} rtl={rtl} onOpen={() => openRide(ride)} />
          ))}
        </>
      ) : (
        <Card style={styles.emptyCard}>
          <View style={styles.emptyIcon}>
            <AppIcon name="navigate-outline" color={palette.green} size={25} />
          </View>
          <Txt size={17} weight="700" rtl={rtl}>
            {tr(rtl, "Your next shared trip starts here", "تبدأ رحلتك المشتركة التالية هنا")}
          </Txt>
          <Txt size={13} color={palette.muted} rtl={rtl}>
            {tr(rtl, "Add both locations to preview matching scheduled rides.", "أضف الموقعين لمعاينة الرحلات المجدولة المطابقة.")}
          </Txt>
        </Card>
      )}
    </PageScroll>
  );

  const renderRideDetail = () => (
    <PageScroll rtl={rtl}>
      <Card>
        <View style={[styles.rideTop, rtl && { flexDirection: "row-reverse" }]}>
          <View style={[styles.person, rtl && { flexDirection: "row-reverse" }]}>
            <Avatar initials={selectedRide.initials} size={54} />
            <View style={{ flex: 1 }}>
              <Txt size={18} weight="800" rtl={rtl}>{selectedRide.driver}</Txt>
              <Txt size={13} color={palette.muted}>★ {selectedRide.rating} · {selectedRide.trips} {tr(rtl, "rides", "رحلة")}</Txt>
            </View>
          </View>
          <Chip label={tr(rtl, "Verified profile", "ملف موثق")} />
        </View>
        <View style={styles.softDivider} />
        <Txt size={13} weight="700" color={palette.muted} rtl={rtl}>{selectedRide.time}</Txt>
        <RouteLine from={selectedRide.from} to={selectedRide.to} rtl={rtl} />
        <View style={[styles.infoRow, rtl && { flexDirection: "row-reverse" }]}>
          <Txt size={13} color={palette.muted} rtl={rtl}>{tr(rtl, "Available seats", "المقاعد المتاحة")}</Txt>
          <Txt size={14} weight="700">{selectedRide.seats}</Txt>
        </View>
        <View style={[styles.infoRow, rtl && { flexDirection: "row-reverse" }]}>
          <Txt size={13} color={palette.muted} rtl={rtl}>{tr(rtl, "Estimated fare", "الأجرة التقديرية")}</Txt>
          <Txt size={17} weight="800" color={palette.green}>{selectedRide.price} JOD</Txt>
        </View>
          <View style={styles.softDivider} />
          <Txt size={14} weight="700" color={palette.teal} rtl={rtl}>{tr(rtl, "Payment preference", "طريقة الدفع")}</Txt>
          <View style={[styles.choiceRow, rtl && { flexDirection: "row-reverse" }]}>
            {(["Wallet", "Cash"] as const).map((method) => (
              <Pressable
                key={method}
                accessibilityRole="radio"
                accessibilityState={{ selected: paymentMethod === method }}
                onPress={() => setPaymentMethod(method)}
                style={[styles.choice, paymentMethod === method && styles.choiceActive]}
              >
                <Txt size={13} weight="700" color={paymentMethod === method ? "#FFFFFF" : palette.teal}>
                  {tr(rtl, method, method === "Wallet" ? "المحفظة" : "نقداً")}
                </Txt>
              </Pressable>
            ))}
          </View>
        <Notice>{tr(rtl, "Fare and seat availability are example data, not a live quote.", "الأجرة والمقاعد بيانات تجريبية وليست عرضاً مباشراً.")}</Notice>
      </Card>
      <Card>
        <SectionTitle title={tr(rtl, "Before you request", "قبل إرسال الطلب")} rtl={rtl} />
        <Txt size={13} color={palette.muted} rtl={rtl}>
          {tr(rtl, "A real booking starts as Pending. The seat is reserved only after the driver accepts and the backend confirms the 1 JOD deposit.", "يبدأ الحجز الحقيقي بحالة قيد الانتظار. لا يُحجز المقعد إلا بعد قبول السائق وتأكيد الخادم لخصم 1 دينار.")}
        </Txt>
      </Card>
      <Button
        title={tr(rtl, "Preview join request", "معاينة طلب الانضمام")}
        onPress={() => {
          previewAction("Join request preview; no booking was submitted");
          go("booking");
        }}
      />
      <Button
        title={tr(rtl, "Chat after acceptance", "المراسلة بعد القبول")}
        secondary
        disabled
        onPress={() => {}}
      />
    </PageScroll>
  );

  const renderBooking = () => (
    <PageScroll rtl={rtl}>
      <Card>
        <View style={styles.previewStatus}>
          <View style={styles.previewStatusIcon}><AppIcon name="time-outline" color={palette.warning} size={25} /></View>
          <View style={{ flex: 1 }}>
            <Txt size={18} weight="800" color={palette.warning} rtl={rtl}>{tr(rtl, "Pending · preview only", "قيد الانتظار · معاينة فقط")}</Txt>
            <Txt size={13} color={palette.muted} rtl={rtl}>{tr(rtl, "No request was sent to a driver.", "لم يُرسل طلب إلى أي سائق.")}</Txt>
          </View>
        </View>
        <RouteLine from={selectedRide.from} to={selectedRide.to} rtl={rtl} />
        <View style={[styles.infoRow, rtl && { flexDirection: "row-reverse" }]}>
          <Txt size={13} color={palette.muted}>{tr(rtl, "Driver", "السائق")}</Txt>
          <Txt size={14} weight="700">{selectedRide.driver}</Txt>
        </View>
        <View style={[styles.infoRow, rtl && { flexDirection: "row-reverse" }]}>
          <Txt size={13} color={palette.muted}>{tr(rtl, "Payment preference", "طريقة الدفع")}</Txt>
          <Txt size={14} weight="700">{tr(rtl, `${paymentMethod} · preview`, paymentMethod === "Wallet" ? "المحفظة · معاينة" : "نقداً · معاينة")}</Txt>
        </View>
        <Notice>{integrationStatus.message}</Notice>
      </Card>
      <Button title={tr(rtl, "Open wallet", "فتح المحفظة")} secondary onPress={() => go("wallet")} />
      <Button title={tr(rtl, "Back to rides", "العودة للرحلات")} onPress={() => tabTo("rides")} />
    </PageScroll>
  );

  const renderMap = () => isDriver ? (
    <PageScroll rtl={rtl}>
      <View>
        <Txt size={23} weight="800" color={palette.teal} rtl={rtl}>{tr(rtl, "Active ride", "الرحلة النشطة")}</Txt>
        <Txt size={13} color={palette.muted} rtl={rtl}>{tr(rtl, "Driver navigation preview", "معاينة تنقل السائق")}</Txt>
      </View>
      <View style={styles.mapCanvas}>
        <View style={[styles.mapStreet, styles.mapStreetOne]} />
        <View style={[styles.mapStreet, styles.mapStreetTwo]} />
        <View style={[styles.mapStreet, styles.mapStreetThree]} />
        <View style={[styles.mapBlock, styles.mapBlockOne]} />
        <View style={[styles.mapBlock, styles.mapBlockTwo]} />
        <View style={[styles.mapBlock, styles.mapBlockThree]} />
        <View style={styles.mapRouteLine} />
        <View style={styles.mapPinStart}><AppIcon name="radio-button-on" color="#FFFFFF" size={12} /></View>
        <View style={styles.mapPinEnd}><AppIcon name="location" color="#FFFFFF" size={16} /></View>
        <View style={styles.mapLocationCard}>
          <Txt size={11} weight="700" color={palette.teal}>{tr(rtl, "ETA · sample", "وقت الوصول · تجريبي")}</Txt>
          <Txt size={11} color={palette.muted}>12 min · GPS unavailable</Txt>
        </View>
      </View>
      <Notice>{tr(rtl, "Illustrative map only. GPS, OSRM, and OpenStreetMap are not connected; no live location is shared.", "خريطة توضيحية فقط. خدمات GPS وOSRM وOpenStreetMap غير متصلة؛ لا تتم مشاركة موقع مباشر.")}</Notice>
      <Card>
        <View style={[styles.rideTop, rtl && { flexDirection: "row-reverse" }]}>
          <View style={[styles.person, rtl && { flexDirection: "row-reverse" }]}>
            <Avatar initials="SJ" tone="teal" />
            <View style={{ flex: 1 }}>
              <Txt size={16} weight="800" rtl={rtl}>Sarah J.</Txt>
              <Txt size={12} color={palette.muted}>★ 4.9 · 6 km · sample</Txt>
            </View>
          </View>
          <Chip label={tr(rtl, "12 min", "12 دقيقة")} tone="teal" />
        </View>
        <RouteLine from="Pickup · Downtown Station" to="Drop-off · 124 Central Park West" rtl={rtl} />
        <View style={[styles.buttonRow, rtl && { flexDirection: "row-reverse" }]}>
          <Button title={tr(rtl, "Message passenger", "مراسلة الراكب")} secondary tone="teal" compact onPress={() => go("chat")} />
          <Button title={tr(rtl, "Preview finish", "معاينة الإنهاء")} tone="teal" compact onPress={() => previewAction("Finish-ride previewed; trip state not changed")} />
        </View>
        <Button title={tr(rtl, "Preview no-show report", "معاينة بلاغ عدم الحضور")} secondary tone="teal" compact onPress={() => previewAction("No-show evidence flow is not connected")} />
      </Card>
    </PageScroll>
  ) : (
    <PageScroll rtl={rtl}>
      <View>
        <Txt size={24} weight="800" color={palette.teal} rtl={rtl}>{tr(rtl, "Trip map", "خريطة الرحلة")}</Txt>
        <Txt size={14} color={palette.muted} rtl={rtl}>{tr(rtl, "Live trip location", "موقع الرحلة المباشر")}</Txt>
      </View>
      <View style={styles.mapCanvas}>
        <View style={[styles.mapStreet, styles.mapStreetOne]} />
        <View style={[styles.mapStreet, styles.mapStreetTwo]} />
        <View style={[styles.mapStreet, styles.mapStreetThree]} />
        <View style={[styles.mapBlock, styles.mapBlockOne]} />
        <View style={[styles.mapBlock, styles.mapBlockTwo]} />
        <View style={[styles.mapBlock, styles.mapBlockThree]} />
        <View style={styles.mapRouteLine} />
        <View style={styles.mapPinStart}><AppIcon name="radio-button-on" color="#FFFFFF" size={12} /></View>
        <View style={styles.mapPinEnd}><AppIcon name="location" color="#FFFFFF" size={16} /></View>
        <View style={styles.mapLocationCard}>
          <Txt size={11} weight="700" color={palette.teal}>{tr(rtl, "Last known position", "آخر موقع معروف")}</Txt>
          <Txt size={11} color={palette.muted}>{tr(rtl, "Map service not connected", "خدمة الخرائط غير متصلة")}</Txt>
        </View>
      </View>
      <Notice>{tr(rtl, "Illustrative route only. GPS, OSRM, and OpenStreetMap are not connected; no live location is shown.", "مسار توضيحي فقط. GPS وOSRM وOpenStreetMap غير متصلة؛ لا يُعرض موقع مباشر.")}</Notice>
      <Card>
        <RouteLine from={selectedRide.from} to={selectedRide.to} rtl={rtl} />
        <View style={[styles.infoRow, rtl && { flexDirection: "row-reverse" }]}>
          <Txt size={13} color={palette.muted}>{tr(rtl, "Tracking status", "حالة التتبع")}</Txt>
          <Chip label={tr(rtl, "Unavailable", "غير متاح")} tone="amber" />
        </View>
      </Card>
    </PageScroll>
  );

  const renderWallet = () => (
    <PageScroll rtl={rtl}>
      <Card style={styles.walletCard}>
        <Txt size={12} weight="600" color="#E7F5EA" rtl={rtl}>{tr(rtl, "WALLET BALANCE · SAMPLE", "رصيد المحفظة · تجريبي")}</Txt>
        <Txt size={34} weight="800" color="#FFFFFF">12.50 JOD</Txt>
        <Button title={tr(rtl, "Request withdrawal", "طلب سحب")} secondary onPress={() => previewAction("Withdrawal preview; no funds were moved")} />
      </Card>
      <Card>
        <SectionTitle title={tr(rtl, "Request a CliQ top-up", "طلب شحن عبر كليك")} rtl={rtl} />
        <Field
          label={tr(rtl, "Amount (JOD)", "المبلغ (دينار)")}
          placeholder="10.00"
          keyboardType="decimal-pad"
          value={topUpAmount}
          onChangeText={setTopUpAmount}
          rtl={rtl}
        />
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            setEvidenceAdded(true);
            previewAction("Evidence attachment control previewed; no file was uploaded");
          }}
          style={[styles.uploadBox, rtl && { flexDirection: "row-reverse" }]}
        >
          <AppIcon name="cloud-upload-outline" color={palette.green} size={23} />
          <View style={{ flex: 1 }}>
            <Txt size={14} weight="700" rtl={rtl}>{evidenceAdded ? tr(rtl, "Evidence control previewed", "تمت معاينة إرفاق الإثبات") : tr(rtl, "Add transfer evidence", "إضافة إثبات التحويل")}</Txt>
            <Txt size={12} color={palette.muted} rtl={rtl}>{tr(rtl, "File upload is not connected", "رفع الملفات غير متصل")}</Txt>
          </View>
        </Pressable>
        <Button
          title={tr(rtl, "Preview top-up request", "معاينة طلب الشحن")}
          onPress={() => {
            if (!topUpAmount.trim() || !evidenceAdded) {
              setNotice(tr(rtl, "Enter an amount and preview the evidence control first.", "أدخل المبلغ وعاين إرفاق الإثبات أولاً."));
              return;
            }
            previewAction("CliQ top-up request preview; nothing was submitted");
          }}
        />
        <Notice>{tr(rtl, "CliQ top-ups require manual review in the real project; this demo does not submit evidence.", "تتطلب عمليات شحن كليك مراجعة يدوية في المشروع الفعلي؛ هذه المعاينة لا ترسل إثباتاً.")}</Notice>
      </Card>
      <SectionTitle title={tr(rtl, "Recent activity · sample", "النشاط الأخير · تجريبي")} rtl={rtl} />
      {sampleTransactions.map((transaction) => (
        <Card key={transaction.title} style={styles.transactionCard}>
          <View style={[styles.transactionIcon, { backgroundColor: transaction.amount.startsWith("+") ? palette.greenSoft : palette.surfaceSoft }]}>
            <AppIcon name={transaction.amount.startsWith("+") ? "add" : "car-outline"} color={palette.green} />
          </View>
          <View style={{ flex: 1 }}>
            <Txt size={14} weight="700" rtl={rtl}>{transaction.title}</Txt>
            <Txt size={12} color={palette.muted}>{transaction.date}</Txt>
          </View>
          <Txt size={13} weight="700" color={transaction.amount.startsWith("+") ? palette.green : palette.text}>{transaction.amount}</Txt>
        </Card>
      ))}
    </PageScroll>
  );

  const renderAlerts = () => (
    <PageScroll rtl={rtl}>
      <Notice>{tr(rtl, "Notifications below are examples; push delivery is not connected.", "الإشعارات أدناه أمثلة؛ خدمة الإشعارات غير متصلة.")}</Notice>
      {[
        { icon: "car-outline" as const, title: "Your ride request is pending", desc: "Alex M. · Today, 08:00 AM", target: "booking" as ScreenId },
        { icon: "wallet-outline" as const, title: "Wallet activity updated", desc: "Sample top-up · Yesterday", target: "wallet" as ScreenId },
        { icon: "chatbubble-outline" as const, title: "New message from Sam K.", desc: "I’ll be at the north entrance.", target: "chat" as ScreenId },
      ].map((item) => (
        <Card key={item.title} onPress={() => go(item.target)}>
          <View style={[styles.alertRow, rtl && { flexDirection: "row-reverse" }]}>
            <View style={styles.alertIcon}><AppIcon name={item.icon} color={palette.green} /></View>
            <View style={{ flex: 1 }}>
              <Txt size={14} weight="700" rtl={rtl}>{item.title}</Txt>
              <Txt size={12} color={palette.muted} rtl={rtl}>{item.desc}</Txt>
            </View>
            <AppIcon name={rtl ? "chevron-back" : "chevron-forward"} color={palette.muted} size={17} />
          </View>
        </Card>
      ))}
    </PageScroll>
  );

  const renderSettings = () => (
    <PageScroll rtl={rtl}>
      <View>
        <Txt size={24} weight="800" color={palette.teal} rtl={rtl}>{tr(rtl, "Settings", "الإعدادات")}</Txt>
        <Txt size={14} color={palette.muted} rtl={rtl}>{tr(rtl, "Account, language, and role", "الحساب واللغة والدور")}</Txt>
      </View>
      <Card onPress={() => go("profile")}>
        <View style={[styles.person, rtl && { flexDirection: "row-reverse" }]}>
          <Avatar initials={userName.split(" ").map((part) => part[0]).slice(0, 2).join("")} size={52} />
          <View style={{ flex: 1 }}>
            <Txt size={17} weight="800" rtl={rtl}>{userName}</Txt>
            <Txt size={13} color={palette.muted} rtl={rtl}>{phone || "+962 00 000 0000"}</Txt>
          </View>
          <AppIcon name={rtl ? "chevron-back" : "chevron-forward"} color={palette.muted} />
        </View>
      </Card>
      <SectionTitle title={tr(rtl, "Preferences", "التفضيلات")} rtl={rtl} />
      <SettingRow
        rtl={rtl}
        icon="language-outline"
        title={tr(rtl, "Language", "اللغة")}
        detail={rtl ? "العربية · RTL" : "English · LTR"}
        onPress={toggleLanguage}
      />
      <SettingRow
        rtl={rtl}
        icon="swap-horizontal-outline"
        title={tr(rtl, "Switch role", "تبديل الدور")}
        detail={isDriver ? tr(rtl, "Driver preview", "معاينة السائق") : tr(rtl, "Passenger preview", "معاينة الراكب")}
        onPress={toggleDriver}
      />
      <SettingRow
        rtl={rtl}
        icon="car-sport-outline"
        title={tr(rtl, "Apply to drive", "التقديم كسائق")}
        detail={tr(rtl, "Vehicle and document details", "بيانات المركبة والوثائق")}
        onPress={() => go("driverApply")}
      />
      <SettingRow
        rtl={rtl}
        icon="wallet-outline"
        title={tr(rtl, "Wallet", "المحفظة")}
        detail={tr(rtl, "Balance and activity", "الرصيد والنشاط")}
        onPress={() => go("wallet")}
      />
      <SettingRow
        rtl={rtl}
        icon="time-outline"
        title={tr(rtl, "Ride history", "سجل الرحلات")}
        detail={tr(rtl, "Past bookings and offered rides", "الحجوزات والرحلات السابقة")}
        onPress={() => go("history")}
      />
      <SettingRow
        rtl={rtl}
        icon="notifications-outline"
        title={tr(rtl, "Notifications", "الإشعارات")}
        detail={tr(rtl, "Example activity", "نشاط تجريبي")}
        onPress={() => go("alerts")}
      />
      <SettingRow
        rtl={rtl}
        icon="location-outline"
        title={tr(rtl, "Location services", "خدمات الموقع")}
        detail={tr(rtl, "Permission requested only when needed", "يُطلب الإذن عند الحاجة فقط")}
        onPress={() => previewAction("Location permission has not been requested in this preview")}
      />
      <SettingRow
        rtl={rtl}
        icon="lock-closed-outline"
        title={tr(rtl, "Password & security", "كلمة المرور والأمان")}
        detail={tr(rtl, "Password, sessions, and security", "كلمة المرور والجلسات والأمان")}
        onPress={() => go("security")}
      />
      <SettingRow
        rtl={rtl}
        icon="help-circle-outline"
        title={tr(rtl, "Help & support", "المساعدة والدعم")}
        detail={tr(rtl, "Send a support request", "إرسال طلب دعم")}
        onPress={() => go("support")}
      />
      <Notice>{tr(rtl, "Driver access and account settings require server confirmation in production.", "يتطلب تفعيل السائق وإعدادات الحساب تأكيد الخادم في النسخة الفعلية.")}</Notice>
    </PageScroll>
  );

  const renderProfile = () => (
    <PageScroll rtl={rtl}>
      <Card>
        <View style={[styles.profilePhotoRow, rtl && { flexDirection: "row-reverse" }]}>
          <Avatar initials={userName.split(" ").map((part) => part[0]).slice(0, 2).join("")} size={66} />
          <View style={{ flex: 1 }}>
            <Txt size={16} weight="700" rtl={rtl}>{tr(rtl, "Profile photo", "الصورة الشخصية")}</Txt>
            <Txt size={12} color={palette.muted} rtl={rtl}>{tr(rtl, "Photo upload is not connected.", "رفع الصور غير متصل.")}</Txt>
          </View>
          <Pressable accessibilityRole="button" onPress={() => previewAction("Photo picker previewed; no file was selected")}>
            <Txt size={13} weight="700" color={palette.green}>{tr(rtl, "Change", "تغيير")}</Txt>
          </Pressable>
        </View>
        <Field label={tr(rtl, "Full name", "الاسم الكامل")} value={userName} onChangeText={setUserName} rtl={rtl} />
        <Field label={tr(rtl, "Phone number", "رقم الهاتف")} value={phone} onChangeText={setPhone} keyboardType="phone-pad" rtl={rtl} />
        <Field label={tr(rtl, "Email (optional)", "البريد الإلكتروني (اختياري)")} placeholder="name@example.com" keyboardType="email-address" autoCapitalize="none" rtl={rtl} />
        <Button title={tr(rtl, "Preview profile update", "معاينة تحديث الملف")} onPress={() => previewAction("Profile update previewed; no account was changed")} />
      </Card>
    </PageScroll>
  );

  const renderSecurity = () => (
    <PageScroll rtl={rtl}>
      <Card>
        <SettingRow
          rtl={rtl}
          icon="lock-closed-outline"
          title={tr(rtl, "Change password", "تغيير كلمة المرور")}
          detail={tr(rtl, "Use the password reset flow", "استخدم خطوات إعادة تعيين كلمة المرور")}
          onPress={() => {
            setResetStage(0);
            go("forgot");
          }}
        />
        <Pressable
          accessibilityRole="switch"
          accessibilityState={{ checked: twoFactorPreview }}
          onPress={() => {
            setTwoFactorPreview((current) => !current);
            previewAction("Two-factor preference previewed; server setting unchanged");
          }}
          style={[styles.securityToggle, rtl && { flexDirection: "row-reverse" }]}
        >
          <View style={styles.settingIcon}><AppIcon name="shield-checkmark-outline" color={palette.green} /></View>
          <View style={{ flex: 1 }}>
            <Txt size={14} weight="700" rtl={rtl}>{tr(rtl, "Two-factor authentication", "المصادقة الثنائية")}</Txt>
            <Txt size={12} color={palette.muted} rtl={rtl}>{tr(rtl, "Preference preview only", "معاينة للتفضيل فقط")}</Txt>
          </View>
          <View style={[styles.switchTrack, twoFactorPreview && styles.switchTrackOn]}>
            <View style={[styles.switchKnob, twoFactorPreview && styles.switchKnobOn]} />
          </View>
        </Pressable>
        <SettingRow
          rtl={rtl}
          icon="phone-portrait-outline"
          title={tr(rtl, "Active sessions", "الجلسات النشطة")}
          detail={tr(rtl, "Session details unavailable", "تفاصيل الجلسات غير متاحة")}
          onPress={() => previewAction("Session list is unavailable without authentication API")}
        />
      </Card>
      <Notice>{tr(rtl, "Never share your password or verification code. Session status and security changes must be confirmed by the authentication service.", "لا تشارك كلمة المرور أو رمز التحقق. يجب تأكيد حالة الجلسة وتغييرات الأمان من خدمة المصادقة.")}</Notice>
    </PageScroll>
  );

  const renderSupport = () => (
    <PageScroll rtl={rtl}>
      <Notice>{tr(rtl, "Support requests and attachments are not connected to a backend, so this preview will not create a ticket.", "طلبات الدعم والمرفقات غير متصلة بالخادم، لذلك لن تنشئ هذه المعاينة تذكرة.")}</Notice>
      <Card>
        <Txt size={17} weight="800" color={palette.teal} rtl={rtl}>{tr(rtl, "What can we help with?", "بماذا يمكننا مساعدتك؟")}</Txt>
        <View style={[styles.categoryWrap, rtl && { flexDirection: "row-reverse" }]}>
          {[
            ["Ride", "رحلة"],
            ["Payment", "دفع"],
            ["Account", "حساب"],
            ["Safety", "السلامة"],
          ].map(([category, categoryAr]) => (
            <Pressable
              key={category}
              accessibilityRole="radio"
              accessibilityState={{ selected: supportCategory === category }}
              onPress={() => setSupportCategory(category)}
              style={[styles.categoryChip, supportCategory === category && styles.categoryChipActive]}
            >
              <Txt size={12} weight="700" color={supportCategory === category ? "#FFFFFF" : palette.teal}>
                {tr(rtl, category, categoryAr)}
              </Txt>
            </Pressable>
          ))}
        </View>
        <Field
          label={tr(rtl, "Describe the issue", "صف المشكلة")}
          placeholder={tr(rtl, "Tell us what happened…", "أخبرنا بما حدث…")}
          value={supportDescription}
          onChangeText={setSupportDescription}
          multiline
          rtl={rtl}
        />
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            setSupportEvidence(true);
            previewAction("Evidence control previewed; no attachment selected");
          }}
          style={[styles.uploadBox, rtl && { flexDirection: "row-reverse" }]}
        >
          <AppIcon name="attach-outline" color={palette.teal} size={21} />
          <View style={{ flex: 1 }}>
            <Txt size={13} weight="700" rtl={rtl}>{supportEvidence ? tr(rtl, "Attachment control previewed", "تمت معاينة حقل المرفق") : tr(rtl, "Add evidence (optional)", "إضافة إثبات (اختياري)")}</Txt>
            <Txt size={11} color={palette.muted} rtl={rtl}>{tr(rtl, "File picker is not connected", "اختيار الملفات غير متصل")}</Txt>
          </View>
        </Pressable>
        <Button
          title={tr(rtl, "Preview support request", "معاينة طلب الدعم")}
          onPress={() => {
            if (supportDescription.trim().length < 8) {
              setNotice(tr(rtl, "Add a few details before previewing the request.", "أضف بعض التفاصيل قبل معاينة الطلب."));
              return;
            }
            previewAction("Support request previewed; no ticket was created");
          }}
        />
      </Card>
    </PageScroll>
  );

  const renderHistory = () => (
    <PageScroll rtl={rtl}>
      <Notice>{tr(rtl, "History is populated with fictional examples until a booking API is available.", "يعرض السجل أمثلة خيالية إلى حين توفر واجهة الحجوزات.")}</Notice>
      <SectionTitle title={tr(rtl, "Recent rides", "الرحلات الأخيرة")} rtl={rtl} />
      {[
        { driver: "Sam K.", route: "Central Station → City Library", date: "Nov 12 · 10:30 AM", status: "Completed", amount: "8.50 JOD" },
        { driver: "Alex M.", route: "Downtown → Tech Park", date: "Nov 10 · 08:00 AM", status: "Cancelled", amount: "0.00 JOD" },
        { driver: "Sarah C.", route: "Eco Library → Central Square", date: "Nov 08 · 09:15 AM", status: "No-show", amount: "1.00 JOD" },
      ].map((ride) => (
        <Card key={ride.driver + ride.date}>
          <View style={[styles.rideTop, rtl && { flexDirection: "row-reverse" }]}>
            <View style={{ flex: 1 }}>
              <Txt size={15} weight="700" rtl={rtl}>{ride.driver}</Txt>
              <Txt size={12} color={palette.muted} rtl={rtl}>{ride.date}</Txt>
            </View>
            <Chip label={ride.status} tone={ride.status === "Completed" ? "green" : ride.status === "No-show" ? "amber" : "gray"} />
          </View>
          <Txt size={14} weight="600" rtl={rtl}>{ride.route}</Txt>
          <View style={[styles.infoRow, rtl && { flexDirection: "row-reverse" }]}>
            <Txt size={12} color={palette.muted}>{tr(rtl, "Fare shown", "الأجرة المعروضة")}</Txt>
            <Txt size={13} weight="700">{ride.amount}</Txt>
          </View>
        </Card>
      ))}
    </PageScroll>
  );

  const renderDriverApply = () => (
    <PageScroll rtl={rtl}>
      <Notice>{tr(rtl, "Driver approval is handled by an administrator. This preview does not upload documents or submit an application.", "تتم الموافقة على السائق من قبل المسؤول. لا ترفع هذه المعاينة وثائق ولا ترسل طلباً.")}</Notice>
      <Card>
        <Txt size={18} weight="800" color={palette.teal} rtl={rtl}>{tr(rtl, "Vehicle details", "بيانات المركبة")}</Txt>
        <Field label={tr(rtl, "Vehicle make and model", "الشركة والطراز")} placeholder={tr(rtl, "e.g. Hyundai Ioniq", "مثال: هيونداي أيونيك")} rtl={rtl} />
        <Field label={tr(rtl, "Vehicle year", "سنة الصنع")} placeholder="2024" keyboardType="number-pad" rtl={rtl} />
        <View style={[styles.choiceRow, rtl && { flexDirection: "row-reverse" }]}>
          {(["Electric", "Hybrid"] as const).map((type) => (
            <Pressable
              key={type}
              onPress={() => setVehicleType(type)}
              style={[styles.choice, vehicleType === type && styles.choiceActive]}
            >
              <Txt size={13} weight="700" color={vehicleType === type ? "#FFFFFF" : palette.teal}>
                {tr(rtl, type, type === "Electric" ? "كهربائية" : "هجينة")}
              </Txt>
            </Pressable>
          ))}
        </View>
      </Card>
      <Card>
        <Txt size={18} weight="800" color={palette.teal} rtl={rtl}>{tr(rtl, "Required documents", "الوثائق المطلوبة")}</Txt>
        {["Driving licence", "Vehicle licence"].map((document) => (
          <Pressable
            key={document}
            accessibilityRole="button"
            onPress={() => {
              setDocumentCount((count) => Math.min(count + 1, 2));
              previewAction(`${document} picker shown; no image uploaded`);
            }}
            style={[styles.uploadBox, rtl && { flexDirection: "row-reverse" }]}
          >
            <AppIcon name="document-text-outline" color={palette.teal} size={22} />
            <View style={{ flex: 1 }}>
              <Txt size={14} weight="700" rtl={rtl}>{tr(rtl, document, document === "Driving licence" ? "رخصة القيادة" : "رخصة المركبة")}</Txt>
              <Txt size={12} color={palette.muted} rtl={rtl}>{tr(rtl, "Tap to preview selection", "اضغط لمعاينة الاختيار")}</Txt>
            </View>
            <AppIcon name="add-circle-outline" color={palette.teal} size={20} />
          </Pressable>
        ))}
        <Txt size={12} color={palette.muted} rtl={rtl}>{tr(rtl, `${documentCount}/2 document controls previewed`, `تمت معاينة ${documentCount}/2 من الوثائق`)}</Txt>
      </Card>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: termsAccepted }}
        onPress={() => setTermsAccepted((accepted) => !accepted)}
        style={[styles.termsRow, rtl && { flexDirection: "row-reverse" }]}
      >
        <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
          {termsAccepted ? <AppIcon name="checkmark" color="#FFFFFF" size={14} /> : null}
        </View>
        <Txt size={13} color={palette.muted} rtl={rtl} style={{ flex: 1 }}>
          {tr(rtl, "I agree to the driver and background-check terms.", "أوافق على شروط السائق والتحقق من الخلفية.")}
        </Txt>
      </Pressable>
      <Button
        tone="teal"
        title={tr(rtl, "Preview application", "معاينة الطلب")}
        onPress={() => {
          if (!termsAccepted || documentCount < 2) {
            setNotice(tr(rtl, "Preview both document controls and accept the terms first.", "عاين حقلي الوثائق ووافق على الشروط أولاً."));
            return;
          }
          previewAction("Driver application previewed; it was not submitted");
        }}
      />
    </PageScroll>
  );

  const renderDriverHome = () => (
    <PageScroll rtl={rtl}>
      <View style={[styles.greetingRow, rtl && { flexDirection: "row-reverse" }]}>
        <View style={{ flex: 1 }}>
          <Txt size={13} color={palette.muted} rtl={rtl}>{tr(rtl, "Driver preview", "معاينة السائق")}</Txt>
          <Txt size={23} weight="800" color={palette.teal} rtl={rtl}>{tr(rtl, "Your rides", "رحلاتك")}</Txt>
        </View>
        <Pressable accessibilityLabel={tr(rtl, "Notifications", "الإشعارات")} onPress={() => go("alerts")} style={styles.iconButton}>
          <AppIcon name="notifications-outline" color={palette.teal} />
        </Pressable>
      </View>
      <Card style={[styles.walletCard, { backgroundColor: palette.teal }]}>
        <Txt size={12} weight="600" color="#CDECE5" rtl={rtl}>{tr(rtl, "WALLET RESERVE · SAMPLE", "احتياطي المحفظة · تجريبي")}</Txt>
        <View style={[styles.walletHeader, rtl && { flexDirection: "row-reverse" }]}>
          <Txt size={29} weight="800" color="#FFFFFF">124.50 JOD</Txt>
          <AppIcon name="wallet-outline" color="#CDECE5" size={24} />
        </View>
        <Button
          title={tr(rtl, "Charge account", "شحن المحفظة")}
          secondary
          tone="teal"
          onPress={() => go("wallet")}
          icon={<AppIcon name="add-circle-outline" color={palette.teal} size={18} />}
        />
      </Card>
      <Card>
        <Button
          title={tr(rtl, "Create new ride", "إنشاء رحلة جديدة")}
          tone="teal"
          onPress={() => go("offerRide")}
          icon={<AppIcon name="add-circle-outline" color="#FFFFFF" size={19} />}
        />
        <Txt size={13} color={palette.muted} rtl={rtl}>{tr(rtl, "Set up a scheduled route and review it before publishing.", "جهّز مساراً مجدولاً وراجعه قبل النشر.")}</Txt>
      </Card>
      <SectionTitle title={tr(rtl, "My rides", "رحلاتي")} action={tr(rtl, "Manage requests", "إدارة الطلبات")} rtl={rtl} onAction={() => tabTo("requests")} />
      <Card style={styles.driverRideCard}>
        <View style={[styles.rideTop, rtl && { flexDirection: "row-reverse" }]}>
          <Chip label={tr(rtl, ridePublishedLocally ? "Local preview" : "Active · sample", ridePublishedLocally ? "معاينة محلية" : "نشطة · مثال")} tone="teal" />
          <Txt size={13} weight="700" color={palette.teal}>45.00 JOD</Txt>
        </View>
        <RouteLine from="Downtown Station" to="Northtown Mall" rtl={rtl} />
        <View style={[styles.infoRow, rtl && { flexDirection: "row-reverse" }]}>
          <Txt size={12} color={palette.muted}>{tr(rtl, "3 seats available · Today, 2:30 PM", "3 مقاعد متاحة · اليوم، 2:30 م")}</Txt>
          <Button title={tr(rtl, "Manage", "إدارة")} compact secondary tone="teal" onPress={() => tabTo("requests")} />
        </View>
        <Button title={tr(rtl, "Preview start ride", "معاينة بدء الرحلة")} compact tone="teal" onPress={() => previewAction("Start-ride action previewed; trip state not changed")} />
      </Card>
      <Button
        title={tr(rtl, "Open accepted-ride messages", "فتح رسائل الرحلة المقبولة")}
        secondary
        tone="teal"
        onPress={() => go("chat")}
        icon={<AppIcon name="chatbubble-outline" color={palette.teal} size={17} />}
      />
      <Notice>{tr(rtl, "Driver tools are a prototype. Approval, wallet reserve, seat count, and ride status must come from the backend.", "أدوات السائق نموذج أولي. يجب أن تأتي الموافقة والرصيد والمقاعد وحالة الرحلة من الخادم.")}</Notice>
    </PageScroll>
  );

  const renderOfferRide = () => (
    <PageScroll rtl={rtl}>
      <Notice>{tr(rtl, "Route, fare, and seat rules must be confirmed by the API. Publishing is disabled in this preview.", "يجب تأكيد المسار والأجرة والمقاعد من الواجهة الخلفية. النشر غير متاح في هذه المعاينة.")}</Notice>
      <Card>
        <Field label={tr(rtl, "Start location", "موقع الانطلاق")} placeholder={tr(rtl, "Enter a location", "أدخل موقعاً")} value={rideFrom} onChangeText={setRideFrom} rtl={rtl} />
        <Field label={tr(rtl, "Destination", "الوجهة")} placeholder={tr(rtl, "Enter a destination", "أدخل الوجهة")} value={rideTo} onChangeText={setRideTo} rtl={rtl} />
        <View style={[styles.formRow, rtl && { flexDirection: "row-reverse" }]}>
          <View style={{ flex: 1 }}>
            <Field label={tr(rtl, "Departure", "المغادرة")} placeholder="Today · 2:30 PM" rtl={rtl} />
          </View>
          <View style={{ width: 104 }}>
            <Field label={tr(rtl, "Seats", "المقاعد")} placeholder="3" value={seatCount} onChangeText={setSeatCount} keyboardType="number-pad" rtl={rtl} />
          </View>
        </View>
        <Button title={tr(rtl, "Add a stop (optional)", "إضافة محطة (اختياري)")} secondary tone="teal" onPress={() => previewAction("Optional stop control shown; route service not connected")} />
      </Card>
      <Card>
        <Txt size={16} weight="700" color={palette.teal} rtl={rtl}>{tr(rtl, "Route preview", "معاينة المسار")}</Txt>
        <View style={[styles.routePreview, rtl && { flexDirection: "row-reverse" }]}>
          <AppIcon name="navigate-outline" color={palette.teal} size={22} />
          <View style={{ flex: 1 }}>
            <Txt size={13} weight="700" rtl={rtl}>{rideFrom || tr(rtl, "Start point", "نقطة الانطلاق")} → {rideTo || tr(rtl, "Destination", "الوجهة")}</Txt>
            <Txt size={12} color={palette.muted} rtl={rtl}>{tr(rtl, "OSRM/Nominatim are not connected", "خدمات OSRM وNominatim غير متصلة")}</Txt>
          </View>
        </View>
      </Card>
      <Button
        tone="teal"
        title={tr(rtl, "Preview ride", "معاينة الرحلة")}
        onPress={() => {
          if (!rideFrom.trim() || !rideTo.trim()) {
            setNotice(tr(rtl, "Add a start and destination first.", "أدخل نقطة الانطلاق والوجهة أولاً."));
            return;
          }
          setRidePublishedLocally(true);
          previewAction("Ride preview saved locally; it was not published");
        }}
      />
    </PageScroll>
  );

  const renderRequests = () => (
    <PageScroll rtl={rtl}>
      <Notice>{tr(rtl, "Requests shown are fictional. Accept/reject actions do not change a ride.", "الطلبات المعروضة خيالية. إجراءات القبول والرفض لا تغيّر الرحلة.")}</Notice>
      {[
        { name: "Nour A.", initials: "NA", rating: "4.9", trips: "18 rides", route: "West End Mall → Innovation Hub" },
        { name: "Omar R.", initials: "OR", rating: "4.7", trips: "9 rides", route: "Central Station → City Library" },
      ].map((request) => (
        <Card key={request.name}>
          <View style={[styles.person, rtl && { flexDirection: "row-reverse" }]}>
            <Avatar initials={request.initials} tone="teal" />
            <View style={{ flex: 1 }}>
              <Txt size={15} weight="700" rtl={rtl}>{request.name}</Txt>
              <Txt size={12} color={palette.muted}>★ {request.rating} · {request.trips}</Txt>
            </View>
            <Chip label={tr(rtl, "Pending", "قيد الانتظار")} tone="amber" />
          </View>
          <Txt size={13} weight="600" rtl={rtl}>{request.route}</Txt>
          <View style={[styles.buttonRow, rtl && { flexDirection: "row-reverse" }]}>
            <Button title={tr(rtl, "Preview accept", "معاينة القبول")} compact tone="teal" onPress={() => previewAction("Request acceptance previewed; no seat was reserved")} />
            <Button title={tr(rtl, "Reject", "رفض")} compact secondary tone="teal" onPress={() => previewAction("Request rejection previewed; no status changed")} />
          </View>
        </Card>
      ))}
      <Notice>{tr(rtl, "Chat is only available after a request is accepted; see the sample conversation in Messages.", "تتاح المحادثة بعد قبول الطلب فقط؛ راجع المحادثة التجريبية في الرسائل.")}</Notice>
    </PageScroll>
  );

  const renderChat = () => (
    <View style={styles.chatScreen}>
      <View>
        <Txt size={16} weight="800" color={palette.teal} rtl={rtl}>{tr(rtl, "Accepted ride · sample conversation", "رحلة مقبولة · محادثة تجريبية")}</Txt>
        <Txt size={12} color={palette.muted} rtl={rtl}>{tr(rtl, "Only confirmed ride participants can message.", "يمكن للمشاركين في الرحلة المؤكدة فقط المراسلة.")}</Txt>
      </View>
      <Notice>{tr(rtl, "Messages stay on this device; chat API is not connected. Maximum length: 1,000 characters.", "تبقى الرسائل على هذا الجهاز؛ المحادثة غير متصلة. الحد الأقصى: 1000 حرف.")}</Notice>
      <ScrollView contentContainerStyle={styles.chatHistory} showsVerticalScrollIndicator={false}>
        {chatMessages.map((message, index) => (
          <View key={`${index}-${message.by}`} style={[styles.chatBubble, message.mine ? styles.chatBubbleMine : styles.chatBubbleOther, rtl && { alignSelf: message.mine ? "flex-start" : "flex-end" }]}>
            {!message.mine ? <Txt size={11} weight="700" color={palette.teal}>{message.by}</Txt> : null}
            <Txt size={14} rtl={rtl}>{message.text}</Txt>
          </View>
        ))}
      </ScrollView>
      <View style={[styles.chatComposer, rtl && { flexDirection: "row-reverse" }]}>
        <TextInput
          value={chatDraft}
          onChangeText={(value) => setChatDraft(value.slice(0, 1001))}
          placeholder={tr(rtl, "Write a message…", "اكتب رسالة…")}
          placeholderTextColor="#98A39A"
          multiline
          maxLength={1001}
          accessibilityLabel={tr(rtl, "Message", "الرسالة")}
          style={[styles.chatInput, rtl && { textAlign: "right", writingDirection: "rtl" }]}
        />
        <Pressable accessibilityRole="button" accessibilityLabel={tr(rtl, "Send message preview", "معاينة إرسال الرسالة")} onPress={sendChat} style={styles.sendButton}>
          <AppIcon name="send" color="#FFFFFF" size={18} />
        </Pressable>
      </View>
      <Txt size={11} color={palette.muted} style={{ textAlign: rtl ? "left" : "right" }}>{chatDraft.length}/1000 · {messageCount} {tr(rtl, "local messages", "رسائل محلية")}</Txt>
    </View>
  );

  const renderPage = (): React.ReactNode => {
    switch (screen) {
      case "login":
      case "signup":
      case "otp":
      case "forgot":
        return renderAuth();
      case "home":
        return renderHome();
      case "rides":
        return renderRides();
      case "rideDetail":
        return renderRideDetail();
      case "booking":
        return renderBooking();
      case "map":
        return renderMap();
      case "wallet":
        return renderWallet();
      case "alerts":
        return renderAlerts();
      case "settings":
        return renderSettings();
      case "profile":
        return renderProfile();
      case "security":
        return renderSecurity();
      case "support":
        return renderSupport();
      case "history":
        return renderHistory();
      case "driverApply":
        return renderDriverApply();
      case "driverHome":
        return renderDriverHome();
      case "offerRide":
        return renderOfferRide();
      case "requests":
        return renderRequests();
      case "chat":
        return renderChat();
      default:
        return renderHome();
    }
  };

  const isAuth = ["login", "signup", "otp", "forgot"].includes(screen);
  if (isAuth) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: screen === "login" ? "#A8E2B6" : palette.background }]}>
        <StatusBar style="dark" />
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1 }}>
          {renderPage()}
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.app}>
        <View style={[styles.header, rtl && { flexDirection: "row-reverse" }]}>
          {showBack ? (
            <Pressable accessibilityRole="button" accessibilityLabel={tr(rtl, "Back", "رجوع")} onPress={back} style={styles.headerAction}>
              <AppIcon name={rtl ? "arrow-forward" : "arrow-back"} color={isDriver ? palette.teal : palette.green} />
            </Pressable>
          ) : (
            <View style={styles.headerAction} />
          )}
          <Txt size={20} weight="800" color={isDriver ? palette.teal : palette.green} style={{ flex: 1, textAlign: "center" }}>
            {headerTitle}
          </Txt>
          <Pressable accessibilityRole="button" accessibilityLabel={tr(rtl, "Notifications", "الإشعارات")} onPress={() => go("alerts")} style={styles.headerAction}>
            <AppIcon name="notifications-outline" color={isDriver ? palette.teal : palette.green} />
          </Pressable>
        </View>
        {notice ? (
          <View style={styles.noticeWrap}>
            <Notice>{notice}</Notice>
          </View>
        ) : null}
        <View style={styles.content}>{renderPage()}</View>
        {showTabs ? (
          <BottomTabs current={screen} driver={isDriver} rtl={rtl} onSelect={tabTo} />
        ) : null}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function SettingRow({
  icon,
  title,
  detail,
  onPress,
  rtl = false,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  detail: string;
  onPress: () => void;
  rtl?: boolean;
}) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[styles.settingRow, rtl && { flexDirection: "row-reverse" }]}>
      <View style={styles.settingIcon}><AppIcon name={icon} color={palette.teal} /></View>
      <View style={{ flex: 1 }}>
        <Txt size={14} weight="700" rtl={rtl}>{title}</Txt>
        <Txt size={12} color={palette.muted} rtl={rtl}>{detail}</Txt>
      </View>
      <AppIcon name={rtl ? "chevron-back" : "chevron-forward"} color={palette.muted} size={17} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: palette.background,
  },
  app: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    height: 54,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "#F7FAF7",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#DCE4DC",
  },
  headerAction: {
    width: 42,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  noticeWrap: {
    paddingHorizontal: 18,
    paddingTop: 9,
    backgroundColor: palette.background,
  },
  authPage: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 27,
    paddingVertical: 24,
    gap: 22,
  },
  authBrand: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 190,
  },
  authHeader: {
    gap: 9,
    alignItems: "flex-start",
  },
  authForm: {
    gap: 14,
  },
  brandLockup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  brandLeaf: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: palette.green,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: palette.line,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  centerLink: {
    alignItems: "center",
    justifyContent: "center",
    minHeight: 34,
  },
  authLanguage: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
    minHeight: 42,
  },
  otpField: {
    gap: 10,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    position: "relative",
    minHeight: 56,
  },
  otpCell: {
    width: 48,
    height: 54,
    borderRadius: 27,
    borderWidth: 1.5,
    borderColor: "#BFCFC2",
    backgroundColor: "rgba(255,255,255,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  otpCellFilled: {
    borderColor: palette.green,
    backgroundColor: "#FFFFFF",
  },
  otpHiddenInput: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0,
  },
  demoBadge: {
    flexDirection: "row",
    gap: 7,
    alignItems: "center",
    alignSelf: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: "rgba(255,255,255,0.65)",
  },
  demoDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#6A9F6E",
  },
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: palette.line,
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#E47A52",
    top: 9,
    right: 10,
  },
  walletCard: {
    backgroundColor: palette.green,
    borderColor: palette.green,
    padding: 20,
  },
  walletHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  walletIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: palette.mint,
    alignItems: "center",
    justifyContent: "center",
  },
  rideTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  person: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    flex: 1,
  },
  avatar: {
    backgroundColor: palette.greenSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  rideBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 5,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: palette.line,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 9,
  },
  emptyCard: {
    alignItems: "center",
    paddingVertical: 28,
  },
  emptyIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: palette.greenSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  softDivider: {
    height: 1,
    backgroundColor: palette.line,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  previewStatus: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  previewStatusIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: palette.warningSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  mapCanvas: {
    height: 280,
    borderRadius: radius.card,
    backgroundColor: "#E8F1E8",
    overflow: "hidden",
    position: "relative",
  },
  mapStreet: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    opacity: 0.82,
  },
  mapStreetOne: {
    width: "120%",
    height: 15,
    top: 66,
    left: -18,
    transform: [{ rotate: "-17deg" }],
  },
  mapStreetTwo: {
    width: "120%",
    height: 12,
    top: 170,
    left: -14,
    transform: [{ rotate: "12deg" }],
  },
  mapStreetThree: {
    width: 14,
    height: "130%",
    left: "58%",
    top: -32,
    transform: [{ rotate: "27deg" }],
  },
  mapBlock: {
    position: "absolute",
    width: 58,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#D9E8D7",
  },
  mapBlockOne: { top: 28, left: 26 },
  mapBlockTwo: { top: 118, right: 24, width: 82, height: 54 },
  mapBlockThree: { bottom: 22, left: 72, width: 70, height: 50 },
  mapRouteLine: {
    position: "absolute",
    width: 145,
    height: 5,
    backgroundColor: palette.green,
    borderRadius: 3,
    left: "30%",
    top: "52%",
    transform: [{ rotate: "-36deg" }],
  },
  mapPinStart: {
    position: "absolute",
    left: "26%",
    top: "58%",
    width: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: palette.green,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  mapPinEnd: {
    position: "absolute",
    right: "27%",
    top: "31%",
    width: 31,
    height: 31,
    borderRadius: 16,
    backgroundColor: palette.teal,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },
  mapLocationCard: {
    position: "absolute",
    top: 12,
    left: 12,
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    gap: 1,
  },
  transactionCard: {
    flexDirection: "row",
    alignItems: "center",
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  alertRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  alertIcon: {
    width: 43,
    height: 43,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.greenSoft,
  },
  settingRow: {
    minHeight: 70,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 13,
    borderRadius: radius.medium,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E6ECE6",
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: palette.tealSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  securityToggle: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  switchTrack: {
    width: 48,
    height: 27,
    borderRadius: 14,
    backgroundColor: "#D4DCD5",
    padding: 3,
    justifyContent: "center",
  },
  switchTrackOn: {
    backgroundColor: "#B9EBC2",
  },
  switchKnob: {
    width: 21,
    height: 21,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
  },
  switchKnobOn: {
    alignSelf: "flex-end",
    backgroundColor: palette.green,
  },
  profilePhotoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  uploadBox: {
    minHeight: 66,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: radius.medium,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#AFC7B3",
    backgroundColor: "#F9FCF9",
  },
  choiceRow: {
    flexDirection: "row",
    gap: 10,
  },
  choice: {
    flex: 1,
    minHeight: 46,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: palette.teal,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  choiceActive: {
    backgroundColor: palette.teal,
  },
  categoryWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryChip: {
    minHeight: 36,
    paddingHorizontal: 13,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: "#9AB8A8",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  categoryChipActive: {
    backgroundColor: palette.teal,
    borderColor: palette.teal,
  },
  termsRow: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#94A69A",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  checkboxChecked: {
    backgroundColor: palette.teal,
    borderColor: palette.teal,
  },
  driverRideCard: {
    borderLeftWidth: 4,
    borderLeftColor: palette.teal,
  },
  formRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  routePreview: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: radius.medium,
    backgroundColor: "#F1F7F5",
  },
  chatScreen: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 12,
  },
  chatHistory: {
    flexGrow: 1,
    justifyContent: "flex-end",
    gap: 10,
    paddingVertical: 10,
  },
  chatBubble: {
    maxWidth: "84%",
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
    gap: 4,
  },
  chatBubbleMine: {
    alignSelf: "flex-end",
    backgroundColor: "#E1F5E4",
    borderBottomRightRadius: 5,
  },
  chatBubbleOther: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: palette.line,
    borderBottomLeftRadius: 5,
  },
  chatComposer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 9,
  },
  chatInput: {
    flex: 1,
    minHeight: 48,
    maxHeight: 110,
    borderRadius: 23,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: palette.line,
    paddingHorizontal: 15,
    paddingTop: 12,
    fontSize: 14,
    color: palette.text,
  },
  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: palette.green,
    alignItems: "center",
    justifyContent: "center",
  },
  tabBar: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 12,
    paddingTop: 5,
    paddingBottom: Platform.OS === "ios" ? 5 : 8,
    backgroundColor: "#F1F4F1",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderColor: "#E5EAE5",
  },
  tabItem: {
    minWidth: 68,
    minHeight: 48,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    borderRadius: radius.pill,
    paddingHorizontal: 9,
  },
  tabItemActive: {
    backgroundColor: palette.green,
  },
});
