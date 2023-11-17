"use client"
import {ApolloSandbox} from "@apollo/sandbox/react";
export default function ApolloEmbed() {
	return (
		<div className="flex h-auto flex-row justify-center">
        <div className="w-4/5 rounded-2xl bg-neutral-300 h-[800px]">
          <ApolloSandbox
            className="h-full w-full"
            initialEndpoint='https://www.gaelscout.com/api/graphql'
          />
        </div>
      </div>
	)
}