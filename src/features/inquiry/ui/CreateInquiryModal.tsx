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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Textarea } from "@/shared/ui/textarea";
import { ReactNode, useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/shared/api/supabase-client";
import { Input } from "@/shared/ui/input";
import { MailQuestionMark } from "lucide-react";
import { useUser } from "@/shared/hooks/useUser";

const CreateInquiryModal = ({ trigger }: { trigger?: ReactNode }) => {
  const [contact, setContact] = useState("");
  const [inquiry, setInquiry] = useState("");
  const [inquiryCategory, setInquiryCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: user } = useUser();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (inquiryCategory === "") {
        toast.error("문의 유형을 선택해주세요.");
        return;
      }

      if (inquiry === "") {
        toast.error("문의사항을 입력해주세요.");
        return;
      }

      const { error } = await supabase.from("inquiry").insert([
        {
          inquiry,
          contact: user ? user.email : contact,
          inquiry_category: inquiryCategory,
        },
      ]);

      if (error) throw error;

      toast.success("문의가 등록되었습니다.");

      setInquiry("");
      setContact("");
      setInquiryCategory("");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(`문의 등록 실패: ${error.message}`);
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
        {trigger || (
          <Button variant="outline" size="icon">
            <MailQuestionMark />
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-left">문의하기</DialogTitle>
          <DialogDescription className="text-left">
            {!user && "신고 기능은 로그인 후 이용할 수 있습니다."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-8">
            <div className="grid gap-3">
              <Textarea
                id="inquiry"
                name="inquiry"
                placeholder="내용을 입력해주세요."
                value={inquiry}
                onChange={(e) => setInquiry(e.target.value)}
              />
            </div>

            <div className="grid gap-3">
              <label htmlFor="contact" className="text-sm">
                연락처 <span className="text-gray-400">(선택)</span>
              </label>
              <Input
                id="contact"
                name="contact"
                type="email"
                placeholder="이메일"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                닫기
              </Button>
            </DialogClose>
            <Button>{isSubmitting ? "등록 중..." : "등록하기"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateInquiryModal;
