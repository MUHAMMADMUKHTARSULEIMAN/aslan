import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";

const SignOnHeader = () => {
  const logged = false;
  return (
    <div className="sticky w-full min-w-screen bg-background top-0 left-0 right-0 z-50">
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div>
            <Link to="/">
              <img
                src="images/logo.svg"
                alt=""
                className="h-6 w-6"
              />
            </Link>
          </div>
          <div className="flex gap-2 items-center">
            {logged ? (
              ""
            ) : (
              <Button variant="first" className="font-bold">
                <Link to="/register-email">Sign in</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
      <hr className="border-2 border-input/30 dark:border-input/10" />
    </div>
  );
};

export default SignOnHeader;
