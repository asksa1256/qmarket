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
import { Textarea } from "@/shared/ui/textarea";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/shared/api/supabase-client";
import { sanitize } from "@/shared/lib/sanitize";
import { Input } from "@/shared/ui/input";
import { Siren } from "lucide-react";
import { useUser } from "@/shared/providers/UserProvider";

const CreateReportModal = () => {
  const [contact, setContact] = useState("");
  const [report, setReport] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useUser();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (report === "") {
        toast.error("문의사항을 입력해주세요.");
        return;
      }

      const createdAt = new Date().toISOString();

      const { error } = await supabase.from("report").insert([
        {
          report: sanitize(report),
          contact: sanitize(contact),
          created_at: createdAt,
        },
      ]);

      if (error) throw error;

      toast.success("신고가 접수되었습니다.");

      setReport("");
      setContact("");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`신고 등록 실패: ${error.message}`);
      } else {
        toast.error("알 수 없는 오류가 발생했습니다.");
      }
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Siren />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mb-4">
          <DialogTitle>신고하기</DialogTitle>
          <DialogDescription>
            * 시세 조작이 의심되는 아이템이나 어뷰징 유저에 대한 신고 내용을
            작성해주세요.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8">
            <div className="grid gap-3">
              <Textarea
                id="report"
                name="report"
                placeholder="내용 입력"
                value={report}
                onChange={(e) => setReport(e.target.value)}
              />
            </div>
            <div className="grid gap-3">
              <label htmlFor="contact" className="text-sm">
                연락처 <span className="text-gray-400">(선택)</span>
              </label>
              <Input
                id="contact"
                name="contact"
                placeholder="이메일 또는 디스코드 아이디"
                value={user ? user.email : contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button variant="outline">닫기</Button>
            </DialogClose>
            <Button type="submit">
              {isSubmitting ? "등록 중..." : "등록하기"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateReportModal;
