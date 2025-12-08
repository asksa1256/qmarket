import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Textarea } from "@/shared/ui/textarea";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/shared/api/supabase-client";
import { sanitize } from "@/shared/lib/sanitize";
import { Siren } from "lucide-react";
import { useUser } from "@/shared/hooks/useUser";

interface ReportData {
  item_name: string;
  discord_id: string;
  details: string;
}

const initialReportState: ReportData = {
  item_name: "",
  discord_id: "",
  details: "",
};

const CreateReportModal = () => {
  const [reportData, setReportData] = useState<ReportData>(initialReportState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { data: user } = useUser();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setReportData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!reportData.item_name && !reportData.discord_id) {
      toast.error("신고 대상 아이템 이름 또는 디스코드 아이디를 입력해주세요.");
      return;
    }

    if (!reportData.details.trim()) {
      toast.error("내용을 작성해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const createdAt = new Date().toISOString();

      const { error } = await supabase.from("report").insert([
        {
          item_name: reportData.item_name || null,
          discord_id: reportData.discord_id || null, // 신고 대상 디스코드 ID
          details: reportData.details,
          contact: user?.email,
          user_id: user?.id, // 제보자 ID
          created_at: createdAt,
        },
      ]);

      if (error) throw error;

      toast.success("신고가 접수되었습니다.");

      setReportData(initialReportState);
      setIsOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`신고 접수 실패: ${error.message}`);
      } else {
        toast.error("알 수 없는 오류가 발생했습니다.");
      }
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" title="신고하기">
          <Siren className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-left">🚨 신고하기</DialogTitle>
          <DialogDescription className="break-keep text-left">
            허위 신고 시 계정이 제재될 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col justify-center gap-2">
              <label htmlFor="item_name" className="text-sm font-medium">
                신고 대상 아이템
              </label>
              <Input
                id="item_name"
                name="item_name"
                value={reportData.item_name}
                onChange={handleInputChange}
                placeholder="아이템명(성별)"
                className="col-span-3"
                required
              />
            </div>

            <div className="flex flex-col justify-center gap-2">
              <label htmlFor="discord_id" className="text-sm font-medium">
                신고 대상 디스코드 아이디
              </label>
              <Input
                id="discord_id"
                name="discord_id"
                value={reportData.discord_id}
                onChange={handleInputChange}
                placeholder="디스코드 아이디"
                className="col-span-3"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="details" className="text-sm font-medium">
                신고 내용
              </label>
              <Textarea
                id="details"
                name="details"
                placeholder="내용을 입력해주세요."
                required
                value={reportData.details}
                className="resize-none min-h-24"
                onChange={handleInputChange}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                닫기
              </Button>
            </DialogClose>
            <Button disabled={isSubmitting}>
              {isSubmitting ? "등록 중..." : "등록하기"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateReportModal;
