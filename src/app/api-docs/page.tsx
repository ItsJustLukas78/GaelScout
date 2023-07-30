import { getApiDocs } from '@/lib/swagger';
import ReactSwagger from './react-swagger';
import ApolloEmbed from '@/components/ApolloEmbed';
import * as Accordion from '@radix-ui/react-accordion';


export default async function IndexPage() {
  const spec = await getApiDocs();
  return (
    <div className="h-auto justify-center flex flex-col mt-32 gap-20">
      <div className="h-auto justify-center flex flex-row">
        <div className="bg-neutral-300 w-4/5 rounded-2xl">
          <ReactSwagger spec={spec} />
        </div>
      </div>
      <ApolloEmbed />
    </div>
  );
}