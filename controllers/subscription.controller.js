import { SERVER_URL } from "../config/env.js";
import { workflowClient } from "../config/upstash.js";
import Subscription from "../models/subscription.model.js";

export const getAllSubscriptions = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      const error = new Error("Admin access required");
      error.status = 403;
      throw error;
    }

    const subscriptions = await Subscription.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: subscriptions });
  } catch (error) {
    next(error);
  }
};

export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });

    const { workflowRunId } = await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body: {
        subscriptionId: subscription.id,
      },
      headers: {
        'content-type': 'application/json',
      },
      retries: 0,
    })

    res.status(201).json({ success: true, data: { subscription, workflowRunId } });
  } catch (e) {
    next(e);
  }
}

export const updateSubscriptions = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      const error = new Error(
        "You are not authorized to update this user's subscriptions"
      );
      error.status = 403;
      throw error;
    }

    const subscriptions = await Subscription.find({ user: req.params.id });

    if (!subscriptions || subscriptions.length === 0) {
      const error = new Error("No subscriptions found for this user");
      error.status = 404;
      throw error;
    }

    const updatedSubscriptions = [];
    for (const subscription of subscriptions) {
      Object.assign(subscription, req.body);
      await subscription.save();
      updatedSubscriptions.push(subscription);
    }

    res.status(200).json({
      success: true,
      count: updatedSubscriptions.length,
      data: updatedSubscriptions,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSubscription = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      const error = new Error("You are not the owner of this account");
      error.status = 401;
      throw error;
    }

    const subscriptions = await Subscription.find({ user: req.params.id });

    if (!subscriptions || subscriptions.length === 0) {
      const error = new Error("Subscription not found");
      error.status = 404;
      throw error;
    }

    await Subscription.deleteMany({ user: req.params.id });

    res.status(200).json({
      success: true,
      message: `${subscriptions.length} subscription(s) deleted`,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserSubscriptions = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      const error = new Error("You are not the owner of this account");
      error.status = 401;
      throw error;
    }

    const subscription = await Subscription.find({ user: req.params.id });

    if (!subscription) {
      const error = new Error("Subscription not found");
      error.status = 404;
      throw error;
    }

    res.status(200).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

export const cancelSubscription = async (req, res, next) => {
  try {
    if (req.user.id !== req.params.id) {
      const error = new Error("You are not the owner of this account");
      error.status = 401;
      throw error;
    }

    const subscriptions = await Subscription.find({ user: req.params.id });

    if (!subscriptions || subscriptions.length === 0) {
      const error = new Error("Subscription not found");
      error.status = 404;
      throw error;
    }

    const cancelledSubscriptions = [];
    for (const subscription of subscriptions) {
      subscription.status = "cancelled";
      await subscription.save();
      cancelledSubscriptions.push(subscription);
    }

    res.status(200).json({
      success: true,
      count: cancelledSubscriptions.length,
      data: cancelledSubscriptions,
    });
  } catch (error) {
    next(error);
  }
};
