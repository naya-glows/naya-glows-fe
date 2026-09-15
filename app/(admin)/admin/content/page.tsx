"use client";

import { Loader2 } from "lucide-react";
import { useListContentQuery } from "../../../store/adminApi";
import { defaultCatalogHeroContent } from "@/lib/content/catalogHero";
import { defaultContactInfoContent } from "@/lib/content/contactInfo";
import { defaultBranchesContent } from "@/lib/content/businessBranches";
import { HomepageGroup } from "./editor/HomepageGroup";
import { SectionShell } from "./editor/SectionShell";
import { useSectionDraft } from "./editor/useSectionDraft";
import { CatalogHeroEditor } from "./editor/sections/CatalogHeroEditor";
import { ContactInfoEditor } from "./editor/sections/ContactInfoEditor";
import { BranchesEditor } from "./editor/sections/BranchesEditor";

function CatalogHeroSection({ overriddenKeys }: { overriddenKeys: Set<string> }) {
  const { draft, update, dirty, save, saving, loading } = useSectionDraft(
    "catalog.hero",
    defaultCatalogHeroContent,
  );
  return (
    <SectionShell
      title="Catalog Hero"
      customized={overriddenKeys.has("catalog.hero")}
      dirty={dirty}
      onSave={save}
      saving={saving}
    >
      {loading || !draft ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-[#4f7957]" />
        </div>
      ) : (
        <CatalogHeroEditor data={draft} onChange={update} />
      )}
    </SectionShell>
  );
}

function ContactInfoSection({ overriddenKeys }: { overriddenKeys: Set<string> }) {
  const { draft, update, dirty, save, saving, loading } = useSectionDraft(
    "contact.info",
    defaultContactInfoContent,
  );
  return (
    <SectionShell
      title="Contact Info"
      customized={overriddenKeys.has("contact.info")}
      dirty={dirty}
      onSave={save}
      saving={saving}
    >
      {loading || !draft ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-[#4f7957]" />
        </div>
      ) : (
        <ContactInfoEditor data={draft} onChange={update} />
      )}
    </SectionShell>
  );
}

function BranchesSection({ overriddenKeys }: { overriddenKeys: Set<string> }) {
  const { draft, update, dirty, save, saving, loading } = useSectionDraft(
    "business.branches",
    defaultBranchesContent,
  );
  return (
    <SectionShell
      title="Branches"
      customized={overriddenKeys.has("business.branches")}
      dirty={dirty}
      onSave={save}
      saving={saving}
    >
      {loading || !draft ? (
        <div className="flex justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin text-[#4f7957]" />
        </div>
      ) : (
        <BranchesEditor data={draft} onChange={update} />
      )}
    </SectionShell>
  );
}

export default function AdminContentPage() {
  const { data: blocks } = useListContentQuery();
  const overriddenKeys = new Set(blocks?.map((b) => b.key));

  return (
    <div>
      <h1 className="text-2xl font-light mb-1">Content</h1>
      <p className="text-sm text-[#16241a]/50 mb-8 max-w-2xl">
        This is how each section looks on the live site. Click any text to edit or
        erase it, or use the image icon on a photo to swap it in. Homepage
        sections share one Save button at the bottom; the other pages below
        save independently.
      </p>

      <div className="flex flex-col gap-8">
        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-[#16241a]/40 mb-4 px-4 sm:px-0">
            Homepage
          </h2>
          {/* Cancels the admin shell's mobile gutter (app/(admin)/admin/layout.tsx's
              p-4) so section cards bleed edge-to-edge on phones, matching their
              squared-off corners there; back to normal at sm+. */}
          <div className="-mx-4 sm:mx-0">
            <HomepageGroup />
          </div>
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-[#16241a]/40 mb-4 px-4 sm:px-0">
            Catalog Page
          </h2>
          <div className="-mx-4 sm:mx-0">
            <CatalogHeroSection overriddenKeys={overriddenKeys} />
          </div>
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-[#16241a]/40 mb-4 px-4 sm:px-0">
            Contact Page
          </h2>
          <div className="-mx-4 sm:mx-0">
            <ContactInfoSection overriddenKeys={overriddenKeys} />
          </div>
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wide text-[#16241a]/40 mb-4 px-4 sm:px-0">
            Business
          </h2>
          <div className="-mx-4 sm:mx-0">
            <BranchesSection overriddenKeys={overriddenKeys} />
          </div>
        </section>
      </div>
    </div>
  );
}
