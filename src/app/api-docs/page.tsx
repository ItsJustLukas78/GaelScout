import { getApiDocs } from '@/lib/swagger';
import ReactSwagger from './react-swagger';
import ApolloEmbed from '@/components/ApolloEmbed';
import * as Accordion from '@radix-ui/react-accordion';


export default async function IndexPage() {
  const spec = await getApiDocs();
  return (
    <div className="mt-32 flex h-auto flex-col justify-center gap-20">
      <div className="flex h-auto flex-row justify-center">
        <div className="w-4/5 rounded-2xl bg-neutral-300">
          <ReactSwagger spec={spec} />
        </div>
      </div>
      <ApolloEmbed />
    </div>
  );
}