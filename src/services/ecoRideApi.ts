/**
 * Integration boundary for the mobile frontend.
 *
 * The linked repository contains no backend routes, API schema, or authentication
 * contract. Keep this app in fixture mode until those contracts are supplied;
 * do not infer endpoints from the product brief.
 */
export const integrationStatus = {
  mode: "demo" as const,
  apiBaseUrlConfigured: Boolean(process.env.EXPO_PUBLIC_API_BASE_URL),
  message:
    "No backend contract is available in this repository. Demo actions stay on this device and are not sent.",
};

export function demoOnly(label: string): string {
  return `${label} · Preview only — nothing was sent or changed on a server.`;
}
