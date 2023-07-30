import { getApiDocs } from '@/lib/swagger';
import ReactSwagger from './react-swagger';

export default async function IndexPage() {
  const spec = await getApiDocs();
  return (
    <div className="h-auto justify-center flex flex-row mt-32">
      <div className="bg-neutral-300 w-4/5 rounded-2xl">
        <ReactSwagger spec={spec} />
      </div>
    </div>
  );
}