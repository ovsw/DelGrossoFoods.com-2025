"use client";

import { useEffect } from "react";

/**
 * Development-only guard that prevents uncaught NotFoundError when a third-party
 * script has reparented nodes and React (or other code) calls removeChild on the
 * original parent. This keeps the dev console clean without changing production.
 */
export function DevDomRemoveTolerance(): null {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    // Patch core DOM node mutation methods in dev to be tolerant when a node
    // has been reparented by third-party code (e.g., sidecarts, overlays).
    const proto = typeof Node !== "undefined" ? Node.prototype : undefined;
    if (!proto) return;

    type InsertBefore = (
      this: Node,
      newChild: Node,
      refChild: Node | null,
    ) => Node;
    type AppendChild = (this: Node, newChild: Node) => Node;
    type RemoveChild = (this: Node, oldChild: Node) => Node;
    type ReplaceChild = (this: Node, newChild: Node, oldChild: Node) => Node;

    const originals = {
      insertBefore: proto.insertBefore as unknown as InsertBefore,
      appendChild: proto.appendChild as unknown as AppendChild,
      removeChild: proto.removeChild as unknown as RemoveChild,
      replaceChild: proto.replaceChild as unknown as ReplaceChild,
    };

    function safeInsertBefore(
      this: Node,
      newChild: Node,
      refChild: Node | null,
    ): Node {
      try {
        if (!refChild || refChild.parentNode !== this) {
          return originals.appendChild.call(this, newChild);
        }
        return originals.insertBefore.call(this, newChild, refChild);
      } catch (err) {
        const msg = String(err ?? "");
        if (msg.includes("NotFoundError") || msg.includes("insertBefore")) {
          return originals.appendChild.call(this, newChild);
        }
        throw err;
      }
    }

    function safeReplaceChild(
      this: Node,
      newChild: Node,
      oldChild: Node,
    ): Node {
      try {
        if (!oldChild || oldChild.parentNode !== this) {
          return originals.appendChild.call(this, newChild);
        }
        return originals.replaceChild.call(this, newChild, oldChild);
      } catch (err) {
        const msg = String(err ?? "");
        if (msg.includes("NotFoundError") || msg.includes("replaceChild")) {
          return originals.appendChild.call(this, newChild);
        }
        throw err;
      }
    }

    function safeRemoveChild(this: Node, child: Node): Node {
      try {
        if (!child || child.parentNode !== this) {
          // Treat as already removed
          return child;
        }
        return originals.removeChild.call(this, child);
      } catch (err) {
        const msg = String(err ?? "");
        if (msg.includes("NotFoundError") || msg.includes("removeChild")) {
          return child;
        }
        throw err;
      }
    }

    (proto as unknown as { insertBefore: InsertBefore }).insertBefore =
      safeInsertBefore as InsertBefore;
    (proto as unknown as { replaceChild: ReplaceChild }).replaceChild =
      safeReplaceChild as ReplaceChild;
    (proto as unknown as { removeChild: RemoveChild }).removeChild =
      safeRemoveChild as RemoveChild;

    return () => {
      (proto as unknown as { insertBefore: InsertBefore }).insertBefore =
        originals.insertBefore;
      (proto as unknown as { replaceChild: ReplaceChild }).replaceChild =
        originals.replaceChild;
      (proto as unknown as { removeChild: RemoveChild }).removeChild =
        originals.removeChild;
    };
  }, []);

  return null;
}
