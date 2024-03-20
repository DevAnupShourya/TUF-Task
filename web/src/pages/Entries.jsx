import React, { useState } from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Code, Spinner, Button } from "@nextui-org/react";
import { useAsyncList } from "@react-stately/data";

import CodeExecutionCell from "../components/CodeExecutionCell";
const API_URL = import.meta.env.VITE_API_URL;

export default function Entries() {
  const [isLoading, setIsLoading] = React.useState(true);
  const [hasMore, setHasMore] = useState(true);

  let list = useAsyncList({
    async load({ signal, cursor }) {
      const res = await fetch(cursor || `${API_URL}/api/snippet?page=`, { signal });
      let json = await res.json();

      if (!cursor) {
        setIsLoading(false);
      }

      setHasMore(json.nextPage);

      return {
        items: json.snippets,
        cursor: json.hasNextPage ? `${API_URL}/api/snippet?page=${json.nextPage}` : null,
      };
    },
  });


  return (
    <section className="w-full h-screen bg-indigo-300 py-8">
      <Table
        isHeaderSticky
        aria-label="Data of Submissions Uploaded by Students"
        bottomContent={
          hasMore && !isLoading ? (
            <div className="flex w-full justify-center">
              <Button isDisabled={list.isLoading} variant="flat" onPress={list.loadMore}>
                {list.isLoading && <Spinner color="white" size="sm" />}
                Load More
              </Button>
            </div>
          ) : null
        }
        className="w-11/12 max-md:w-full h-[90vh] mx-auto"
      >
        <TableHeader>
          <TableColumn key="username">Username</TableColumn>
          <TableColumn key="code_lang">Code Language</TableColumn>
          <TableColumn key="stdin">Stdin</TableColumn>
          <TableColumn key="code">Code</TableColumn>
          <TableColumn key="date">Uploaded</TableColumn>
          <TableColumn key="result">Result</TableColumn>
        </TableHeader>
        <TableBody
          isLoading={isLoading}
          items={list.items}
          loadingContent={<Spinner label="Loading..." />}
        >
          {(item) => {
            return (
              <TableRow key={item.id}>
                <TableCell className="text-primary">@{item.username}</TableCell>
                <TableCell className="capitalize">{item.language_name}</TableCell>
                <TableCell>
                  {item.stdin ?
                    <Code color="success">{item.stdin}</Code> : <Code color="danger">null</Code>
                  }
                </TableCell>
                <TableCell>
                  {item.source_code ?
                    <Code color="success">{item.source_code.slice(0, 100)}</Code> : <Code color="danger">null</Code>
                  }
                </TableCell>
                <TableCell>{new Date(item.timestamp).toLocaleDateString()}</TableCell>
                <TableCell>
                  <CodeExecutionCell
                    key={`${item.username}-${item.judge0_token}`}
                    judge0_token={item.judge0_token} />
                </TableCell>
              </TableRow>
            )
          }}

        </TableBody>
      </Table>
    </section>
  );
}
