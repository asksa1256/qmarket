import { toast } from "sonner";

export const copyToClipboard = (text: string, msg: string) => {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      toast.success(msg);
    })
    .catch((err) => {
      toast.error(`복사 실패: ${err}`);
    });
};
