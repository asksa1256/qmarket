export const getRankStyles = (rank?: number) => {
  switch (rank) {
    case 1:
      return {
        cardBg:
          "bg-[radial-gradient(ellipse_farthest-corner_at_right_bottom,#FEDB37_0%,#FDB931_8%,#9f7928_30%,#8A6E2F_40%,transparent_80%),radial-gradient(ellipse_farthest-corner_at_left_top,#FFFFFF_0%,#FFFFAC_8%,#D1B464_25%,#5d4a1f_62.5%,#5d4a1f_100%)]",
        border: "border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.3)]",
        badge:
          "bg-gradient-to-tr from-yellow-300 via-yellow-500 to-yellow-600 text-white",
        crown: "text-yellow-500",
        label: "🥇 1st",
      };
    case 2:
      return {
        cardBg: "bg-gradient-to-br from-[#F1F5F9] via-[#94A3B8] to-[#475569]",
        border: "border-slate-300 shadow-[0_0_10px_rgba(203,213,225,0.2)]",
        badge:
          "bg-gradient-to-tr from-slate-300 via-slate-400 to-slate-500 text-white",
        crown: "text-slate-400",
        label: "🥈 2nd",
      };
    case 3:
      return {
        cardBg: "bg-gradient-to-br from-[#b29f94] to-[#805730]",
        border: "border-amber-900/10 shadow-[0_0_10px_rgba(251,146,60,0.2)]",
        badge:
          "bg-gradient-to-tr from-amber-500 via-amber-600 to-amber-700 text-white",
        crown: "text-amber-700",
        label: "🥉 3rd",
      };
    default:
      return {
        cardBg: "bg-white",
        border: "border-border",
        badge: "bg-gray-200 text-gray-600",
        crown: "hidden",
        label: `${rank}th`,
      };
  }
};
