import { Dialog } from '@headlessui/react'
import type { ReactNode } from 'react'

interface ModalWindowProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export default function ModalWindow({ isOpen, onClose, title, children }: ModalWindowProps) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md border border-slate-200">
          {title && (
            <Dialog.Title className="text-xl font-semibold text-slate-800 mb-5 pb-3 border-b border-slate-100">
              {title}
            </Dialog.Title>
          )}
          {children}
        </Dialog.Panel>
      </div>
    </Dialog>
  )
}
