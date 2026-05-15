import * as Notifications from "expo-notifications";
const CATEGORY_ID = "shopping_reminder";

function randomMinute(): number {
  // return Math.floor(Math.random() * 30) + 30;
  return 1;
}
function buildNotifications(
  username: string,
  period: string
): {
  day: number;
  month?: "current" | "previous";
  title: string;
  body: string;
}[] {
  const name = username || "você";

  const inicio = [
    {
      day: 27,
      month: "current" as const,
      title: `Oi ${name}! 🛒`,
      body: "O mês está quase acabando, que tal já montar sua lista de compras?",
    },
    {
      day: 1,
      month: "current" as const,
      title: `Bom dia, ${name}! 🛒`,
      body: "O mês começou, hora de organizar suas compras!",
    },
    {
      day: 3,
      month: "current" as const,
      title: `${name}, sua lista espera por você 😊`,
      body: "Ainda dá tempo de se organizar para as compras do mês.",
    },
  ];

  const meio = [
    {
      day: 11,
      month: "current" as const,
      title: `Oi ${name}! 👀`,
      body: "A metade do mês está chegando, bora preparar a lista?",
    },
    {
      day: 15,
      month: "current" as const,
      title: `${name}, hora de reabastecer! 🛒`,
      body: "Estamos no meio do mês, sua lista te espera.",
    },
    {
      day: 19,
      month: "current" as const,
      title: `${name}, ainda dá tempo! 😊`,
      body: "Organize suas compras antes da correria do fim do mês.",
    },
  ];

  const final = [
    {
      day: 22,
      month: "current" as const,
      title: `Oi ${name}! 🛒`,
      body: "O fim do mês está chegando, bora preparar a lista?",
    },
    {
      day: 26,
      month: "current" as const,
      title: `${name}, faltam poucos dias! 🛒`,
      body: "Não deixa pra última hora, sua lista te espera.",
    },
    {
      day: 28,
      month: "current" as const,
      title: `${name}, sua lista está esperando! 😊`,
      body: "Aproveite os últimos dias do mês para se organizar.",
    },
  ];

  switch (period) {
    case "inicio":
      return inicio;
    case "meio":
      return meio;
    case "final":
      return final;
    case "inicio_final":
      return [...final, ...inicio];
    default:
      return [];
  }
}
export async function setupNotificationCategory() {
  await Notifications.setNotificationCategoryAsync(CATEGORY_ID, [
    {
      identifier: "already_done",
      buttonTitle: "Já fiz minhas compras ✓",
      options: { isDestructive: false, isAuthenticationRequired: false },
    },
    {
      identifier: "thank_you",
      buttonTitle: "Obrigado por lembrar 😊",
      options: { isDestructive: false, isAuthenticationRequired: false },
    },
  ]);
}
export async function requestPermissions(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}
export async function scheduleNotifications(username: string, period: string) {
  await setupNotificationCategory();
  console.log(username, period);
  const granted = await requestPermissions();
  if (!granted) {
    console.log("PERMISSÃO NEGADA");
    return;
  }
  await Notifications.cancelAllScheduledNotificationsAsync();
  const notifications = buildNotifications(username, period);
  const now = new Date();
  const today = now.getDate();
  let nextNotification = notifications.find((notif) => notif.day >= today);
  let triggerMonth = now.getMonth();
  let triggerYear = now.getFullYear();
  for (const notif of notifications) {
    let triggerMonth = now.getMonth();
    let triggerYear = now.getFullYear();

    const triggerDate = new Date(
      triggerYear,
      triggerMonth,
      notif.day,
      7,
      randomMinute(),
      0
    );
    // const triggerDate = new Date(
    //   now.getFullYear(),
    //   4,
    //   14,
    //   21,
    //   randomMinute(),
    //   0
    // );
    if (triggerDate < now) {
      triggerMonth += 1;

      if (triggerMonth > 11) {
        triggerMonth = 0;
        triggerYear += 1;
      }

      triggerDate.setMonth(triggerMonth);
      triggerDate.setFullYear(triggerYear);
    }

    console.log(
      `Agendando: ${notif.title} para ${triggerDate.toLocaleString()}`
    );
    await Notifications.scheduleNotificationAsync({
      content: {
        title: notif.title,
        body: notif.body,
        categoryIdentifier: CATEGORY_ID,
        data: { period },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: triggerDate,
      },
    });
  }
  const all = await Notifications.getAllScheduledNotificationsAsync();
  console.log("NOTIFICAÇÕES AGENDADAS:", all);
}

export async function cancelAllNotifications() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
