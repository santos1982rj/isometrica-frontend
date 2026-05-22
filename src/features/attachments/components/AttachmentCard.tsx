import {
  Download,
  FileText,
} from 'lucide-react';

import type { LessonAttachment } from '../attachments.types';

type AttachmentCardProps = {
  attachment: LessonAttachment;
};

function formatFileSize(size: number | null) {
  if (!size) {
    return 'Tamanho indisponível';
  }

  const sizeInMb = size / 1024 / 1024;

  if (sizeInMb >= 1) {
    return `${sizeInMb.toFixed(1)} MB`;
  }

  return `${Math.round(size / 1024)} KB`;
}

/**
 * Card visual de anexo da aula.
 */
export function AttachmentCard({
  attachment,
}: AttachmentCardProps) {
  return (
    <a
      href={attachment.url}
      target="_blank"
      rel="noreferrer"
      className="group flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] bg-[var(--surface-soft)] p-3 transition hover:border-[var(--border-strong)] hover:bg-[var(--surface)]"
    >
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--iso-primary-soft)] text-[var(--iso-primary)]">
          <FileText className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--text)]">
            {attachment.nome}
          </p>

          <p className="mt-1 truncate text-xs text-[var(--text-muted)]">
            {attachment.tipo} • {formatFileSize(attachment.tamanho)}
          </p>
        </div>
      </div>

      <Download className="h-5 w-5 text-[var(--text-muted)] transition group-hover:text-[var(--text)]" />
    </a>
  );
}
