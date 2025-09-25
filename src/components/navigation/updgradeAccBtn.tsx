import React from 'react'
import Link from 'next/link'
import { getUserForms } from '@/app/actions/getUserForms'
import { MAX_FREE_FROMS } from '@/lib/utils'
import ProgressBar from '../progressBar'
import SubscribeBtn from '@/app/subscription/SubscribeBtn'
import { auth } from '@/auth'
import { getUserSubscription } from '@/app/actions/userSubscriptions'

type Props = {}

const UpdgradeAccBtn = async (props: Props) => {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return null;
  }
  const subscription = await getUserSubscription({ userId });
  if (subscription) {
    return null;
  }
  const forms = await getUserForms();
  const formCount = forms.length;
  const percent = (formCount / MAX_FREE_FROMS) * 100;

   return (
    <div className="p-4 mb-4 text-left text-xs rounded-xl border border-neutral-200 bg-white">
      <ProgressBar value={percent} />
       <p className="mt-2 text-neutral-700">{formCount} out of {MAX_FREE_FROMS} forms generated.</p>
      <p className="mt-1">
        <SubscribeBtn price="price_1S2ztEJzIxKfRO98gM7YwHkO" locale="en" />
       {" "}<span className="text-[var(--brand-orange-600)] font-medium">for unlimited forms.</span>
      </p>
    </div>
  )
}

export default UpdgradeAccBtn