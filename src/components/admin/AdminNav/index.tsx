'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { LogOut, Menu } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'

const NAV_GROUPS = [
  {
    titleKey: 'view',
    items: [
      { href: '/admin/brands', labelKey: 'brands', match: 'exact' },
      { href: '/admin/cars', labelKey: 'cars', match: 'exact' },
    ],
  },
  {
    titleKey: 'create',
    items: [
      { href: '/admin/brands/new', labelKey: 'createBrand', match: 'prefix' },
      { href: '/admin/cars/new', labelKey: 'createCar', match: 'prefix' },
    ],
  },
] as const

type AdminNavProps = {
  adminName?: string | null
}

export default function AdminNav({ adminName }: AdminNavProps) {
  const t = useTranslations('AdminNav')
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    contentRef.current?.querySelectorAll<HTMLAnchorElement>('a[data-admin-nav-link]').forEach((link) => {
      link.tabIndex = 0
    })
  })

  async function handleLogout() {
    if (loggingOut) return

    setLoggingOut(true)
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
      })
      if (!response.ok) throw new Error('Logout failed')

      setOpen(false)
      router.replace('/auth/sign-in')
      router.refresh()
    } catch {
      toast.error(t('logoutFailed'), { position: 'top-right', className: '!bg-red-100 !text-red-500' })
      setLoggingOut(false)
    }
  }

  return (
    <HoverCard open={open} onOpenChange={setOpen} openDelay={100} closeDelay={150}>
      <HoverCardTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="cursor-pointer"
          aria-expanded={open}
          aria-controls="admin-nav-content"
          onPointerUp={(event) => {
            if (event.pointerType === 'touch') setOpen((value) => !value)
          }}
        >
          <Menu aria-hidden="true" />
          {t('menu')}
        </Button>
      </HoverCardTrigger>

      <HoverCardContent id="admin-nav-content" align="end" sideOffset={8} className="w-72 p-2">
        <div ref={contentRef}>
          {adminName && (
            <p className="mb-2 truncate px-2 text-xs text-muted-foreground md:hidden" title={adminName}>
              {t('label')}: {adminName}
            </p>
          )}

          <nav aria-label={t('label')} className="space-y-2">
            {NAV_GROUPS.map((group, index) => (
              <div
                key={group.titleKey}
                role="group"
                aria-labelledby={`admin-nav-${group.titleKey}`}
                className={index > 0 ? 'border-t border-border pt-2' : undefined}
              >
                <p
                  id={`admin-nav-${group.titleKey}`}
                  className="mb-1.5 px-2 text-xs font-medium uppercase tracking-wide text-muted-foreground"
                >
                  {t(group.titleKey)}
                </p>
                <div className="flex flex-col gap-0.5">
                  {group.items.map((item) => {
                    const active =
                      item.match === 'exact'
                        ? pathname === item.href
                        : pathname === item.href || (pathname?.startsWith(`${item.href}/`) ?? false)

                    return (
                      <Button
                        key={item.href}
                        asChild
                        variant={active ? 'secondary' : 'ghost'}
                        size="sm"
                        className="w-full cursor-pointer justify-start"
                        aria-current={active ? 'page' : undefined}
                      >
                        <Link href={item.href} data-admin-nav-link>
                          {t(item.labelKey)}
                        </Link>
                      </Button>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>

          <div className="mt-2 border-t border-border pt-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full cursor-pointer justify-start"
              onClick={handleLogout}
              disabled={loggingOut}
              aria-busy={loggingOut}
            >
              <LogOut aria-hidden="true" />
              {loggingOut ? t('loggingOut') : t('logout')}
            </Button>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
