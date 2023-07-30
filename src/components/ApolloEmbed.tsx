"use client"
import {ApolloSandbox} from "@apollo/sandbox/react";

export default function ApolloEmbed() {
	return (
		<div className="h-auto justify-center flex flex-row">
        <div className="h-[800px] bg-neutral-300 w-4/5 rounded-2xl">
          <ApolloSandbox
            className="h-full w-full"
            initialEndpoint='https://www.gaelscout.com/api/graphql'
          />
        </div>
      </div>
	)
}