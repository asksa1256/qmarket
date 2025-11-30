"use client";

import CreateInquiryModal from "@/features/inquiry/ui/CreateInquiryModal";
import { Button } from "../../../shared/ui/button";

export default function LinkToOpenInquiryModal() {
  return (
    <CreateInquiryModal
      trigger={
        <Button variant="link" className="px-0 hover:text-blue-600">
          문의하기
        </Button>
      }
    />
  );
}
