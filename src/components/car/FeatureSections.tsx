import { ShieldCheck, Sparkles } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Card, CardContent } from '@/components/ui/card'
import { FeatureList } from '@/components/car/FeatureList'

type FeatureSectionsProps = {
  intelligentAssist?: string[]
  security?: string[]
}

export default function FeatureSections({ intelligentAssist, security }: FeatureSectionsProps) {
  const t = useTranslations('Features')
  const hasAssist = (intelligentAssist ?? []).length > 0
  const hasSecurity = (security ?? []).length > 0

  if (!hasAssist && !hasSecurity) return null

  return (
    <div className="mt-6 grid gap-6 sm:grid-cols-2">
      {hasAssist && (
        <Card className="p-5 shadow-md">
          <CardContent className="p-0">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
              <Sparkles className="size-5 text-primary" aria-hidden="true" />
              {t('intelligentAssist')}
            </h2>
            <FeatureList items={intelligentAssist ?? []} />
          </CardContent>
        </Card>
      )}
      {hasSecurity && (
        <Card className="p-5 shadow-md">
          <CardContent className="p-0">
            <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
              <ShieldCheck className="size-5 text-primary" aria-hidden="true" />
              {t('security')}
            </h2>
            <FeatureList items={security ?? []} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
