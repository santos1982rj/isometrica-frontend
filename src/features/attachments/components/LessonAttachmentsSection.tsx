import { Paperclip } from 'lucide-react';

import { SectionHeader } from '../../../components/ui/SectionHeader';

import { AttachmentCard } from './AttachmentCard';

import type { LessonAttachment } from '../attachments.types';

type LessonAttachmentsSectionProps = {
  attachments: LessonAttachment[];
};

/**
 * Seção visual de materiais complementares da aula.
 */
export function LessonAttachmentsSection({
  attachments,
}: LessonAttachmentsSectionProps) {
  return (
    <section className="mt-5">
      <SectionHeader
        eyebrow="Materiais de apoio"
        title="Anexos da aula"
        description="Consulte PDFs, listas e arquivos técnicos vinculados ao conteúdo."
        action={
          <div className="flex h-10 w-10 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--surface-soft)] text-[var(--iso-primary)]">
            <Paperclip className="h-5 w-5" />
          </div>
        }
      />

      {attachments.length === 0 ? (
        <p className="text-[var(--text-muted)]">
          Nenhum material complementar disponível para esta aula.
        </p>
      ) : (
        <div className="space-y-3">
          {attachments.map((attachment) => (
            <AttachmentCard
              key={attachment.id}
              attachment={attachment}
            />
          ))}
        </div>
      )}
    </section>
  );
}
